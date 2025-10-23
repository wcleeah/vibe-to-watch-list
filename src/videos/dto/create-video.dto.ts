import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  customName: string;
}