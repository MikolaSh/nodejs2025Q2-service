import {
  Body,
  Controller,
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

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() { name, year, artistId }: CreateAlbumDto): Album {
    return this.albumService.createAlbum(name, year, artistId);
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumService.updateAlbum(id, updateAlbumDto);
  }
}
