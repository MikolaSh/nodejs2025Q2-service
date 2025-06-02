import { isValidUUID } from 'src/utils';
import { Track } from './entities/track.entety';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: Array<Track> = [
    {
      id: uuidv4(),
      name: 'All I need',
      artistId: null,
      albumId: null,
      duration: 324,
    },
  ];

  getAllTracks() {
    return this.tracks;
  }

  getTrackById(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const track = this.tracks.find((user) => user.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }
}
