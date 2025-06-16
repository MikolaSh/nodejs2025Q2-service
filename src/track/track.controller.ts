import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks(): Promise<Track[]> {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string): Promise<Track> {
    return this.trackService.getTrackById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() dto: CreateTrackDto): Promise<Track> {
    return this.trackService.createTrack(
      dto.name,
      dto.artistId,
      dto.albumId,
      dto.duration,
    );
  }

  @Put(':id')
  updateTrack(
    @Param('id') id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<Track> {
    return this.trackService.updateTrack(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string): Promise<void> {
    await this.trackService.deleteTrack(id);
  }
}
