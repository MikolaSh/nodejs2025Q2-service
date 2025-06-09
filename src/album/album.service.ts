import { Album } from './entities/album.entity';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAllAlbums() {
    return await this.albumRepository.find();
  }

  async getAlbumById(id: string) {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async createAlbum(name: string, year: number, artistId: string | null) {
    const newAlbum = this.albumRepository.create({ name, year, artistId });
    return this.albumRepository.save(newAlbum);
  }

  async updateAlbum(id: string, { name, year, artistId }: UpdateAlbumDto) {
    const album = await this.getAlbumById(id);

    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return this.albumRepository.save(album);
  }

  async deleteAlbum(id: string) {
    const album = await this.getAlbumById(id);

    await this.trackService.removeAlbumFromTracks(id);
    this.favoritesService.removeAlbumFromFavorites(id);

    await this.albumRepository.remove(album);
  }

  async removeArtistFromAlbums(artistId: string) {
    const albums = await this.albumRepository.find({ where: { artistId } });

    for (const album of albums) {
      album.artistId = null;
      await this.albumRepository.save(album);
    }
  }
}
