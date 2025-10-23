import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('videos')
@UseGuards(AuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get('to-watch')
  findToWatch() {
    return this.videosService.findToWatch();
  }

  @Get('watched')
  findWatched() {
    return this.videosService.findWatched();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Patch(':id/watch')
  @HttpCode(HttpStatus.OK)
  markAsWatched(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.markAsWatched(id);
  }

  @Patch(':id/unwatch')
  @HttpCode(HttpStatus.OK)
  markAsUnwatched(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.markAsUnwatched(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.remove(id);
  }
}