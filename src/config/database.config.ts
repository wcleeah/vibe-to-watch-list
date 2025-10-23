import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Video } from '../videos/video.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const env = process.env.NODE_ENV || 'development';
  
  // Use PostgreSQL for Vercel deployment
  if (env === 'production' || process.env.VERCEL) {
    return {
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      entities: [Video],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    };
  }
  
  // SQLite for local development only
  return {
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Video],
    synchronize: true,
  };
};