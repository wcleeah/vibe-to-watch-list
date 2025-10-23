class VideoApp {
    constructor() {
        this.apiBase = '/api/videos';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadVideos();
    }

    bindEvents() {
        document.getElementById('add-video-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addVideo();
        });

        // Auto-fill title when URL is pasted
        document.getElementById('video-url').addEventListener('input', (e) => {
            const url = e.target.value;
            const customNameField = document.getElementById('custom-name');
            
            if (url && !customNameField.value) {
                this.fetchVideoTitle(url);
            }
        });

        // Handle suggestion button click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('use-suggestion-btn')) {
                const suggestionTitle = e.target.parentElement.querySelector('.suggestion-title').textContent;
                document.getElementById('custom-name').value = suggestionTitle;
                document.getElementById('title-suggestion').style.display = 'none';
            }
        });

        const modal = document.getElementById('video-preview-modal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async addVideo() {
        const form = document.getElementById('add-video-form');
        const formData = new FormData(form);
        
        const videoData = {
            url: formData.get('url'),
            customName: formData.get('customName')
        };

        try {
            const response = await fetch(this.apiBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(videoData)
            });

            if (response.ok) {
                form.reset();
                this.loadVideos();
            } else {
                const error = await response.json();
                alert('Error adding video: ' + (error.message || 'Unknown error'));
            }
        } catch (error) {
            alert('Error adding video: ' + error.message);
        }
    }

    async loadVideos() {
        try {
            const [toWatchResponse, watchedResponse] = await Promise.all([
                fetch(`${this.apiBase}/to-watch`),
                fetch(`${this.apiBase}/watched`)
            ]);

            const toWatchVideos = await toWatchResponse.json();
            const watchedVideos = await watchedResponse.json();

            this.renderVideoList('to-watch-list', toWatchVideos, false);
            this.renderVideoList('watched-list', watchedVideos, true);
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }

    renderVideoList(containerId, videos, isWatched) {
        const container = document.getElementById(containerId);
        
        if (videos.length === 0) {
            container.innerHTML = '<div class="empty-state">No videos yet</div>';
            return;
        }

        container.innerHTML = videos.map(video => this.createVideoItem(video, isWatched)).join('');
    }

    createVideoItem(video, isWatched) {
        const thumbnail = video.thumbnailUrl ? 
            `<div class="thumbnail-container">
                <img src="${video.thumbnailUrl}" 
                     alt="${video.customName}" 
                     onload="this.style.opacity='1'"
                     onerror="app.handleThumbnailError(this, '${video.url}')"
                     style="opacity:0; transition: opacity 0.3s ease;">
            </div>` : 
            `<div class="video-thumbnail video-thumbnail-placeholder">
                <span class="thumbnail-icon">${video.contentType === 'playlist' ? '📋' : '🎬'}</span>
                <span class="thumbnail-text">No Preview</span>
            </div>`;
        
        const contentTypeIcon = video.contentType === 'playlist' ? '📋' : '🎥';
        const contentTypeLabel = video.contentType === 'playlist' ? 'Playlist' : 'Video';
        
        const watchButton = isWatched ? 
            `<button class="btn-small btn-unwatch" onclick="app.markAsUnwatched(${video.id})">Mark as Unwatched</button>` :
            `<button class="btn-small btn-watch" onclick="app.markAsWatched(${video.id})">Mark as Watched</button>`;

        return `
            <div class="video-item" onclick="app.showPreview(${video.id})">
                ${thumbnail}
                <h3>${contentTypeIcon} ${this.escapeHtml(video.customName)}</h3>
                <div class="video-meta">
                    <div class="video-tags">
                        <span class="video-platform">${video.platform}</span>
                        <span class="content-type">${contentTypeLabel}</span>
                    </div>
                </div>
                <div class="video-actions" onclick="event.stopPropagation()">
                    ${watchButton}
                    <button class="btn-small btn-delete" onclick="app.deleteVideo(${video.id})">Delete</button>
                </div>
            </div>
        `;
    }

    async markAsWatched(id) {
        try {
            await fetch(`${this.apiBase}/${id}/watch`, {
                method: 'PATCH'
            });
            this.loadVideos();
        } catch (error) {
            alert('Error marking video as watched: ' + error.message);
        }
    }

    async markAsUnwatched(id) {
        try {
            await fetch(`${this.apiBase}/${id}/unwatch`, {
                method: 'PATCH'
            });
            this.loadVideos();
        } catch (error) {
            alert('Error marking video as unwatched: ' + error.message);
        }
    }

    async deleteVideo(id) {
        if (confirm('Are you sure you want to delete this video?')) {
            try {
                await fetch(`${this.apiBase}/${id}`, {
                    method: 'DELETE'
                });
                this.loadVideos();
            } catch (error) {
                alert('Error deleting video: ' + error.message);
            }
        }
    }

    async showPreview(id) {
        try {
            const response = await fetch(`${this.apiBase}/${id}`);
            const video = await response.json();
            
            const modal = document.getElementById('video-preview-modal');
            const content = document.getElementById('video-preview-content');
            
            const contentTypeIcon = video.contentType === 'playlist' ? '📋' : '🎥';
            const contentTypeLabel = video.contentType === 'playlist' ? 'Playlist' : 'Video';
            
            let previewHtml = `
                <h2>${contentTypeIcon} ${this.escapeHtml(video.customName)}</h2>
                <p><strong>Platform:</strong> ${video.platform}</p>
                <p><strong>Type:</strong> ${contentTypeLabel}</p>
                <p><strong>URL:</strong> <a href="${video.url}" target="_blank">${video.url}</a></p>
                <p><strong>Status:</strong> ${video.isWatched ? 'Watched' : 'To Watch'}</p>
            `;

            if (video.platform === 'youtube') {
                const videoId = this.extractYouTubeVideoId(video.url);
                const playlistId = this.extractYouTubePlaylistId(video.url);
                
                if (video.contentType === 'playlist' && playlistId) {
                    previewHtml += `
                        <div style="margin-top: 20px;">
                            <iframe width="100%" height="400" 
                                src="https://www.youtube.com/embed/videoseries?list=${playlistId}" 
                                frameborder="0" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                } else if (videoId) {
                    previewHtml += `
                        <div style="margin-top: 20px;">
                            <iframe width="100%" height="400" 
                                src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                }
            }

            content.innerHTML = previewHtml;
            modal.style.display = 'block';
        } catch (error) {
            alert('Error loading video preview: ' + error.message);
        }
    }

    closeModal() {
        document.getElementById('video-preview-modal').style.display = 'none';
    }

    extractYouTubeVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    extractYouTubePlaylistId(url) {
        const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    async fetchVideoTitle(url) {
        const customNameField = document.getElementById('custom-name');
        const suggestionDiv = document.getElementById('title-suggestion');
        const suggestionTitle = suggestionDiv.querySelector('.suggestion-title');
        
        try {
            // Show loading state
            const originalPlaceholder = customNameField.placeholder;
            customNameField.placeholder = 'Fetching video title...';
            suggestionDiv.style.display = 'none';
            
            const videoId = this.extractYouTubeVideoId(url);
            const playlistId = this.extractYouTubePlaylistId(url);
            
            if (videoId || playlistId) {
                // Use YouTube oEmbed API to get title
                const embedUrl = videoId ? 
                    `https://www.youtube.com/watch?v=${videoId}` : 
                    `https://www.youtube.com/playlist?list=${playlistId}`;
                
                const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(embedUrl)}&format=json`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.title) {
                        // Show suggestion instead of auto-filling
                        suggestionTitle.textContent = data.title;
                        suggestionDiv.style.display = 'flex';
                        customNameField.placeholder = originalPlaceholder;
                        return;
                    }
                }
            }
            
            // Fallback: extract from URL parameters or page title
            this.fallbackTitleExtraction(url, customNameField, originalPlaceholder, suggestionDiv, suggestionTitle);
            
        } catch (error) {
            console.log('Could not fetch video title:', error);
            customNameField.placeholder = 'Enter a custom name...';
            suggestionDiv.style.display = 'none';
        }
    }

    fallbackTitleExtraction(url, customNameField, originalPlaceholder, suggestionDiv, suggestionTitle) {
        try {
            // Try to extract from URL if it has a title parameter
            const urlObj = new URL(url);
            const title = urlObj.searchParams.get('title') || 
                         urlObj.searchParams.get('name') ||
                         urlObj.pathname.split('/').pop();
            
            if (title && title !== 'watch') {
                const cleanTitle = decodeURIComponent(title).replace(/[-_]/g, ' ');
                suggestionTitle.textContent = cleanTitle;
                suggestionDiv.style.display = 'flex';
            } else {
                // Generate a friendly name from the video ID
                const videoId = this.extractYouTubeVideoId(url);
                if (videoId) {
                    suggestionTitle.textContent = `Video ${videoId}`;
                    suggestionDiv.style.display = 'flex';
                }
            }
            customNameField.placeholder = originalPlaceholder;
        } catch (error) {
            customNameField.placeholder = originalPlaceholder;
            suggestionDiv.style.display = 'none';
        }
    }

    handleThumbnailError(img, originalUrl) {
        const videoId = this.extractYouTubeVideoId(originalUrl);
        
        if (videoId && img.src.includes('maxresdefault')) {
            // Try high quality
            img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        } else if (videoId && img.src.includes('hqdefault')) {
            // Try medium quality  
            img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        } else if (videoId && img.src.includes('mqdefault')) {
            // Try default quality
            img.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
        } else {
            // Replace container with placeholder
            const container = img.parentNode;
            const placeholder = document.createElement('div');
            placeholder.className = 'video-thumbnail video-thumbnail-placeholder';
            placeholder.innerHTML = `
                <span class="thumbnail-icon">🎬</span>
                <span class="thumbnail-text">No Preview</span>
            `;
            container.parentNode.replaceChild(placeholder, container);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const app = new VideoApp();