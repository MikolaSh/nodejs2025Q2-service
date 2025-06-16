import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TrackModule } from 'src/track/track.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { Album } from './entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, LoggingService],
  exports: [AlbumService],
})
export class AlbumModule {}
