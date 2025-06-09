import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites, FavoritesResponse } from './entities/favorites.entity';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  private readonly SINGLE_ID = '00000000-0000-0000-0000-000000000000';

  constructor(
    @InjectRepository(Favorites)
    private readonly favRepo: Repository<Favorites>,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {}

  private async getOrCreate(): Promise<Favorites> {
    let fav = await this.favRepo.findOne({ where: { id: this.SINGLE_ID } });
    if (!fav) {
      fav = this.favRepo.create({
        id: this.SINGLE_ID,
        artists: [],
        albums: [],
        tracks: [],
      });
      await this.favRepo.save(fav);
    }
    return fav;
  }

  async getAll(): Promise<FavoritesResponse> {
    const fav = await this.getOrCreate();

    const [artists, albums, tracks] = await Promise.all([
      Promise.all(
        fav.artists.map((id) =>
          this.artistService.getArtistById(id).catch(() => null),
        ),
      ),
      Promise.all(
        fav.albums.map((id) =>
          this.albumService.getAlbumById(id).catch(() => null),
        ),
      ),
      Promise.all(
        fav.tracks.map((id) =>
          this.trackService.getTrackById(id).catch(() => null),
        ),
      ),
    ]);

    return {
      artists: artists.filter(Boolean),
      albums: albums.filter(Boolean),
      tracks: tracks.filter(Boolean),
    };
  }

  async addTrack(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid track ID');
    await this.trackService.getTrackById(id);
    const fav = await this.getOrCreate();
    if (!fav.tracks.includes(id)) {
      fav.tracks.push(id);
      await this.favRepo.save(fav);
    }
  }

  async removeTrack(id: string) {
    const fav = await this.getOrCreate();
    const index = fav.tracks.indexOf(id);
    if (index === -1) throw new NotFoundException('Track not in favorites');
    fav.tracks.splice(index, 1);
    await this.favRepo.save(fav);
  }

  async addAlbum(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid album ID');
    await this.albumService.getAlbumById(id);
    const fav = await this.getOrCreate();
    if (!fav.albums.includes(id)) {
      fav.albums.push(id);
      await this.favRepo.save(fav);
    }
  }

  async removeAlbum(id: string) {
    const fav = await this.getOrCreate();
    const index = fav.albums.indexOf(id);
    if (index === -1) throw new NotFoundException('Album not in favorites');
    fav.albums.splice(index, 1);
    await this.favRepo.save(fav);
  }

  async addArtist(id: string) {
    if (!validate(id)) throw new BadRequestException('Invalid artist ID');
    await this.artistService.getArtistById(id);
    const fav = await this.getOrCreate();
    if (!fav.artists.includes(id)) {
      fav.artists.push(id);
      await this.favRepo.save(fav);
    }
  }

  async removeArtist(id: string) {
    const fav = await this.getOrCreate();
    const index = fav.artists.indexOf(id);
    if (index === -1) throw new NotFoundException('Artist not in favorites');
    fav.artists.splice(index, 1);
    await this.favRepo.save(fav);
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    const fav = await this.getOrCreate();
    fav.tracks = fav.tracks.filter((id) => id !== trackId);
    await this.favRepo.save(fav);
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    const fav = await this.getOrCreate();
    fav.albums = fav.albums.filter((id) => id !== albumId);
    await this.favRepo.save(fav);
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    const fav = await this.getOrCreate();
    fav.artists = fav.artists.filter((id) => id !== artistId);
    await this.favRepo.save(fav);
  }
}
