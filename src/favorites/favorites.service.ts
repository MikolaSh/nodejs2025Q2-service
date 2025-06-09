import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { isValidUUID } from '../utils';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Favorites, FavoritesResponse } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    const artists = await Promise.all(
      this.favorites.artists.map(async (id) => {
        try {
          return await this.artistService.getArtistById(id);
        } catch {
          return null;
        }
      }),
    ).then((res) => res.filter((artist) => artist !== null));

    const albums = await Promise.all(
      this.favorites.albums.map(async (id) => {
        try {
          return await this.albumService.getAlbumById(id);
        } catch {
          return null;
        }
      }),
    ).then((res) => res.filter((album) => album !== null));

    const tracks = await Promise.all(
      this.favorites.tracks.map(async (id) => {
        try {
          return await this.trackService.getTrackById(id);
        } catch {
          return null;
        }
      }),
    ).then((res) => res.filter((track) => track !== null));

    return { artists, albums, tracks };
  }

  addTrack(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    try {
      this.trackService.getTrackById(id);
      if (!this.favorites.tracks.includes(id)) {
        this.favorites.tracks.push(id);
      }
    } catch (e) {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  removeTrack(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }

    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }

    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    try {
      this.albumService.getAlbumById(id);
      if (!this.favorites.albums.includes(id)) {
        this.favorites.albums.push(id);
      }
    } catch (e) {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  removeAlbum(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }

    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid atist ID');
    }

    try {
      this.artistService.getArtistById(id);
      if (!this.favorites.artists.includes(id)) {
        this.favorites.artists.push(id);
      }
    } catch (e) {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  removeArtist(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID');
    }

    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }

    this.favorites.artists.splice(index, 1);
  }

  removeTrackFromFavorites(trackId: string): void {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }

  removeAlbumFromFavorites(albumId: string): void {
    const index = this.favorites.albums.indexOf(albumId);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  removeArtistFromFavorites(artistId: string): void {
    const index = this.favorites.artists.indexOf(artistId);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }
}
