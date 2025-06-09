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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtist(@Param('id') id: string) {
    return this.artistService.getArtistById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() { name, grammy }: CreateArtistDto) {
    return this.artistService.createArtist(name, grammy);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string) {
    await this.artistService.deleteArtist(id);
  }
}
