import { isValidUUID } from 'src/utils';
import { Track } from './entities/track.entety';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  private tracks: Array<Track> = [
    {
      id: uuidv4(),
      name: 'No suprises',
      artistId: 'b9387067-eef5-4c7a-9045-765286b3e52d',
      albumId: 'd73dca6f-5ec9-4301-9dc9-296e8178a5a7',
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

  createTrack(
    name: string,
    artistId: string,
    albumId: string,
    duration: number,
  ): Track {
    const newTrack = {
      id: uuidv4(),
      name,
      artistId,
      albumId,
      duration,
    };
    this.tracks.push(newTrack);

    return newTrack;
  }

  updateTrack(
    id: string,
    { name, artistId, albumId, duration }: UpdateTrackDto,
  ) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const track = this.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;

    return track;
  }

  deleteTrack(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const trackIndex = this.tracks.findIndex((u) => u.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.tracks.splice(trackIndex, 1);
  }

  removeArtistFromTracks(artistId: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  removeAlbumFromTracks(albumId: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
