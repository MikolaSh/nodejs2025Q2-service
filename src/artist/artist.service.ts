import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { validate } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  getAllArtists() {
    return this.artistRepository.find();
  }

  async getArtistById(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async createArtist(name: string, grammy: boolean): Promise<Artist> {
    const artist = this.artistRepository.create({ name, grammy });
    return this.artistRepository.save(artist);
  }

  async updateArtist(id: string, updateDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.getArtistById(id);
    this.artistRepository.merge(artist, updateDto);
    return this.artistRepository.save(artist);
  }

  async deleteArtist(id: string) {
    const artist = await this.getArtistById(id);

    await this.albumService.removeArtistFromAlbums(id);
    await this.trackService.removeArtistFromTracks(id);
    await this.favoritesService.removeArtistFromFavorites(id);

    await this.artistRepository.remove(artist);
  }
}
