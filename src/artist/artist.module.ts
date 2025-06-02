import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [AlbumModule, TrackModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
