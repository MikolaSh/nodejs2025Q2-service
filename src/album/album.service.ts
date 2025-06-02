import { isValidUUID } from 'src/utils';
import { Album } from './entities/album.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: Array<Album> = [
    {
      id: uuidv4(),
      name: 'In Rainbows',
      year: 2001,
      artistId: null,
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
      throw new NotFoundException('User not found');
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
}
