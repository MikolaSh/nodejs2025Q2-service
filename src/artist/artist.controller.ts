import { Controller, Get, Param } from '@nestjs/common';
import { ArtistService } from './artist.service';

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
}
