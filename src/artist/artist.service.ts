import { isValidUUID } from 'src/utils';
import { Artist } from './entities/artist.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(AlbumService) private readonly albumService: AlbumService,
    @Inject(TrackService) private readonly trackService: TrackService,
  ) {}

  private artists: Array<Artist> = [
    {
      id: 'b9387067-eef5-4c7a-9045-765286b3e52d',
      name: 'Radiohead',
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

  updateArtist(id: string, { name, grammy }: UpdateArtistDto) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artist = this.getArtistById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = name;
    artist.grammy = grammy;

    return artist;
  }

  deleteArtist(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artistIndex = this.artists.findIndex((u) => u.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.albumService.removeArtistFromAlbums(id);
    this.trackService.removeArtistFromTracks(id);

    this.artists.splice(artistIndex, 1);
  }
}
