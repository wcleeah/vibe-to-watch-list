import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  customName: string;

  @Column({ default: false })
  isWatched: boolean;

  @Column({ nullable: true })
  platform: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  contentType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}