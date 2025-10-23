import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'url', type: 'text' })
  url: string;

  @Column({ name: 'custom_name', type: 'text' })
  customName: string;

  @Column({ name: 'is_watched', type: 'boolean', default: false })
  isWatched: boolean;

  @Column({ name: 'platform', type: 'text', nullable: true })
  platform: string | null;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'content_type', type: 'text', nullable: true })
  contentType: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
