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
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { LoggingService } from 'src/logging/logging.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  async getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(
    @Body() { name, year, artistId }: CreateAlbumDto,
  ): Promise<Album> {
    return this.albumService.createAlbum(name, year, artistId);
  }

  @Put(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string) {
    await this.albumService.deleteAlbum(id);
  }
}
