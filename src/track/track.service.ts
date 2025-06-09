import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoritesService } from 'src/favorites/favorites.service';
import { isValidUUID } from 'src/utils';
import { Track } from './entities/track.entety';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAllTracks(): Promise<Track[]> {
    return this.trackRepo.find();
  }

  async getTrackById(id: string): Promise<Track> {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const track = await this.trackRepo.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Promise<Track> {
    const newTrack = this.trackRepo.create({
      name,
      artistId,
      albumId,
      duration,
    });
    return this.trackRepo.save(newTrack);
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.getTrackById(id);

    track.name = dto.name;
    track.artistId = dto.artistId;
    track.albumId = dto.albumId;
    track.duration = dto.duration;

    return this.trackRepo.save(track);
  }

  async deleteTrack(id: string): Promise<void> {
    const track = await this.getTrackById(id);

    await this.favoritesService.removeTrackFromFavorites(id);
    await this.trackRepo.delete(track.id);
  }

  async removeArtistFromTracks(artistId: string): Promise<void> {
    await this.trackRepo
      .createQueryBuilder()
      .update(Track)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }

  async removeAlbumFromTracks(albumId: string): Promise<void> {
    await this.trackRepo
      .createQueryBuilder()
      .update(Track)
      .set({ albumId: null })
      .where('albumId = :albumId', { albumId })
      .execute();
  }
}
