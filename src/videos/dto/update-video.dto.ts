import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class UpdateVideoDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  customName?: string;

  @IsBoolean()
  @IsOptional()
  isWatched?: boolean;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  contentType?: string;
}