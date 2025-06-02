import { isValidUUID } from 'src/utils';
import { Album } from './entities/album.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  private albums: Array<Album> = [
    {
      id: 'd73dca6f-5ec9-4301-9dc9-296e8178a5a7',
      name: 'OK Computer',
      year: 1997,
      artistId: 'b9387067-eef5-4c7a-9045-765286b3e52d',
    },
  ];

  getAllAlbums() {
    return this.albums;
  }

  getAlbumById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID format');
    }

    const album = this.albums.find((user) => user.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  createAlbum(name: string, year: number, artistId: string | null): Album {
    const newAlbum = {
      id: uuidv4(),
      name,
      year,
      artistId,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  updateAlbum(id: string, { name, year, artistId }: UpdateAlbumDto) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID format');
    }

    const album = this.getAlbumById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return album;
  }

  deleteAlbum(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID format');
    }

    const artistIndex = this.albums.findIndex((u) => u.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(artistIndex, 1);
  }

  removeArtistFromAlbums(artistId: string) {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
