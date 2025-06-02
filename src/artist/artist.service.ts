import { isValidUUID } from 'src/utils';
import { Artist } from './entities/artist.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Array<Artist> = [
    {
      id: uuidv4(),
      name: 'Ivan Dorn',
      grammy: false,
    },
  ];

  getAllArtists() {
    return this.artists;
  }

  getArtistById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const artist = this.artists.find((user) => user.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  createArtist(name: string, grammy: boolean): Artist {
    const newArtist = {
      id: uuidv4(),
      name,
      grammy,
    };

    this.artists.push(newArtist);

    return newArtist;
  }
}
