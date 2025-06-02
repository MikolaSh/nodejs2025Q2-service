import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getArtist(@Param('id') id: string) {
    return this.artistService.getArtistById(id);
  }

  @Post()
  create(@Body() { name, grammy }: CreateArtistDto): Artist {
    return this.artistService.createArtist(name, grammy);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Artist {
    return this.artistService.updateArtist(id, updateArtistDto);
  }
}
