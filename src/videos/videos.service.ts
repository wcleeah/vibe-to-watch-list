import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const platform = this.extractPlatform(createVideoDto.url);
    const { thumbnailUrl, contentType } = this.generateThumbnailAndType(createVideoDto.url, platform);
    
    const video = this.videoRepository.create({
      ...createVideoDto,
      platform,
      thumbnailUrl,
      contentType,
    });
    
    return this.videoRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return this.videoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findToWatch(): Promise<Video[]> {
    return this.videoRepository.find({
      where: { isWatched: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findWatched(): Promise<Video[]> {
    return this.videoRepository.find({
      where: { isWatched: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findOne(id);
    
    if (updateVideoDto.url && updateVideoDto.url !== video.url) {
      const platform = this.extractPlatform(updateVideoDto.url);
      const { thumbnailUrl, contentType } = this.generateThumbnailAndType(updateVideoDto.url, platform);
      updateVideoDto = { ...updateVideoDto, platform, thumbnailUrl, contentType };
    }
    
    await this.videoRepository.update(id, updateVideoDto);
    return this.findOne(id);
  }

  async markAsWatched(id: number): Promise<Video> {
    return this.update(id, { isWatched: true });
  }

  async markAsUnwatched(id: number): Promise<Video> {
    return this.update(id, { isWatched: false });
  }

  async remove(id: number): Promise<void> {
    const video = await this.findOne(id);
    await this.videoRepository.remove(video);
  }

  private extractPlatform(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    if (url.includes('nebula.tv')) {
      return 'nebula';
    }
    return 'unknown';
  }

  private generateThumbnailAndType(url: string, platform: string): { thumbnailUrl: string | null; contentType: string } {
    if (platform === 'youtube') {
      const videoId = this.extractYouTubeVideoId(url);
      const playlistId = this.extractYouTubePlaylistId(url);
      
      if (playlistId) {
        // For playlists, use the first video's thumbnail if available, otherwise try playlist thumbnail
        return {
          thumbnailUrl: videoId ? 
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 
            `https://i.ytimg.com/vi_webp/${playlistId}/maxresdefault.webp`,
          contentType: 'playlist'
        };
      } else if (videoId) {
        return {
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          contentType: 'video'
        };
      }
    }
    
    return {
      thumbnailUrl: null,
      contentType: 'video'
    };
  }

  private extractYouTubeVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  private extractYouTubePlaylistId(url: string): string | null {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}