import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Users } from './repository/user';
import { UserController } from './controllers/user.contoller';
import { UserService } from './services/user.service';
import { Video } from './repository/video';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { YoutubeApiService, YoutubeCronService } from './services/youtube.service';
import { CacheModule } from '@nestjs/cache-manager';
import { VideoService } from './services/videos.service';
import { VideoController } from './controllers/videos.controller';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'new_user',
    password: 'password',
    database: 'db',
    entities: [Users, Video],
    synchronize: true,
  }), TypeOrmModule.forFeature([Users, Video]),
  ScheduleModule.forRoot(),CacheModule.register()
  ],
  controllers: [UserController,CustomerController,VideoController],
  providers: [UserService,CustomerService,YoutubeApiService,YoutubeCronService,VideoService],
})
export class AppModule { }
