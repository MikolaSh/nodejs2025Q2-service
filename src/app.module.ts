import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Artist } from './artist/entities/artist.entity';
import { Album } from './album/entities/album.entity';
import { Track } from './track/entities/track.entety';
import { Favorites } from './favorites/entities/favorites.entity';
import { LoggingService } from './logging/logging.service';
import { LoggingMiddleware } from './logging/logging.middleware';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { GlobalAuthGuard } from './auth/global-auth.guard';
@Module({
  imports: [
    FavoritesModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'homelibrary',
      entities: [User, Artist, Album, Track, Favorites],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggingService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
