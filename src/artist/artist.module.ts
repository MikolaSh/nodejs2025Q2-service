import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [AlbumModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
