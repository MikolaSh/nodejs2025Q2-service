import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { Artist } from './entities/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
