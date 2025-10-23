# Vibe To Watch List

A web app that tracks all your "want-to-watch" content across multiple platforms.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run start:dev
   ```

3. Visit http://localhost:3000

## Database Configuration

### Development (SQLite)
- Uses local `database.sqlite` file
- Automatically creates tables with `synchronize: true`
- No additional setup required

### Production (PostgreSQL)
- Requires PostgreSQL database
- Uses migrations for schema management
- Set environment variables:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_SSL=true  # Set to false for local PostgreSQL
```

## Deployment on Vercel

### Quick Deploy to Vercel

1. **Connect to GitHub** and import your repository
2. **Add Vercel Postgres**:
   - Go to your project dashboard
   - Click "Storage" → "Create Database" → "Postgres"
   - Vercel will automatically set environment variables

3. **Deploy**:
   ```bash
   # Vercel will automatically run:
   npm run build
   npm run migration:run
   ```

### Manual Vercel Setup

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Add database from Vercel dashboard or CLI:
   ```bash
   vercel storage create postgres
   ```

### Other Deployment Options

### Option 1: Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## Environment Variables

### Local Development
Create `.env` file:
```bash
NODE_ENV=development
DATABASE_URL=database.sqlite
```

### Vercel Deployment
Vercel automatically sets these when you add Postgres:
- `POSTGRES_URL` - Main database connection
- `POSTGRES_PRISMA_URL` - For ORM connections  
- `POSTGRES_URL_NON_POOLING` - Direct connections
- `NODE_ENV=production`
- `VERCEL=1`

### Manual PostgreSQL Setup
```bash
NODE_ENV=production
POSTGRES_URL=postgresql://user:password@host:port/database
```

## API Endpoints

- `POST /api/videos` - Add new video
- `GET /api/videos/to-watch` - Get unwatched videos
- `GET /api/videos/watched` - Get watched videos
- `PATCH /api/videos/:id/watch` - Mark as watched
- `PATCH /api/videos/:id/unwatch` - Mark as unwatched
- `DELETE /api/videos/:id` - Delete video

## Platform Support

- **YouTube**: Automatic thumbnail generation and video preview
- **Nebula**: Platform detection (preview coming soon)
- **Others**: Basic URL storage with custom names