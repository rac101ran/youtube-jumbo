import axios from 'axios';
import { Inject, Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Video } from 'src/repository/video';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class YoutubeApiService {
    constructor() { require('dotenv').config() }
    async fetchMostPopularVideos(): Promise<any> {
        const apiKey = process.env.YOUTUBE_API_KEY
        console.log(apiKey)
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=10&key=${apiKey}`;

        try {
            const response = await axios.get(apiUrl);
            console.log(response.data.items.length)
            return response.data.items;
        } catch (error) {
            throw new Error('Unable to fetch most popular videos from YouTube API.');
        }
    }
}


@Injectable()
export class YoutubeCronService {
    private readonly logger = new Logger(YoutubeCronService.name);

    constructor(
        private readonly youtubeApiService: YoutubeApiService,
        @InjectRepository(Video) private videoRepository: Repository<Video>,
        @Inject('CACHE_MANAGER') private readonly cacheManager: Cache
    ) { }

    @Cron(CronExpression.EVERY_2ND_HOUR)
    async fetchAndStoreMostPopularVideos() {
        try {
            this.logger.log('Fetching and storing most popular videos every 2 hours...');
            const videos = await this.youtubeApiService.fetchMostPopularVideos();

            for (const video of videos) {

                const cachedVideoId = await this.cacheManager.get(video.id)
                if (!cachedVideoId) {
                    const existingVideo = await this.videoRepository.findOne({ where: { videoId: video.videoId } });
                    if (!existingVideo) {
                        const newVideo = this.videoRepository.create({
                            videoId: video.id,
                            title: this.handleSpecialCharacters(video.snippet.title),
                            description: video.description = this.handleSpecialCharacters(video.snippet.description).substring(0, 10),
                            videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
                            thumbnailUrl: video.snippet.thumbnails.default.url,
                            publishedAt: video.snippet.publishedAt,
                        });
                        await this.videoRepository.save(newVideo);
                    }
                    const val : number = await this.cacheManager.get("totalVideos")
                    if(!val) {
                        await this.cacheManager.set("totalVideos",1)
                    }else {
                        await this.cacheManager.set("totalVideos",val + 1)
                    }
                    await this.cacheManager.set(video.videoId, video.statistics.viewCount);
                }
            }
            this.logger.log('Fetched and stored videos:', videos);
        } catch (error) {
            console.log(error.message)
            throw new HttpException('Error fetching and storing videos', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private handleSpecialCharacters(description: string): string {
        return description.replace(/[\uD800-\uDBFF]./g, '');
    }
}