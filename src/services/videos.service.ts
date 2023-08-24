import { Injectable, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, In } from 'typeorm';
import { Video } from 'src/repository/video';
import { Users } from 'src/repository/user';
import { Cache } from 'cache-manager';
@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        @Inject('CACHE_MANAGER') private readonly cacheManager: Cache
    ) { }

    async getAllVideos(page: number, limit: number, userId: number) {
        try {

            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['watchLaterVideos'] });
            const watchedVideoIds = user.watchLaterVideos.map(video => video.videoId);

            const videos = await this.videoRepository.find({
                where: { videoId: Not(In(watchedVideoIds)) },
                order: { publishedAt: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });

            let totalVideos = 0 //  await this.cacheManager.get<number>("totalVideos")  
            totalVideos = await this.videoRepository.count({ where: { videoId: Not(In(watchedVideoIds)) } });
            // if (!totalVideos || totalVideos === 0) {
            //     totalVideos = await this.videoRepository.count({ where: { videoId: Not(In(watchedVideoIds)) } });
            // }

            console.log(`page total : ${Math.ceil(totalVideos / limit)} , page num : ${page}}`)

            return {
                status: HttpStatus.OK,
                message: 'Videos fetched successfully',
                data: videos,
                pageInfo: {
                    pageNum: page,
                    limitPerPage: limit,
                    totalPages: Math.ceil(totalVideos / limit)
                }
            };
        } catch (error) {
            console.log(error.message)
            throw new HttpException('Error fetching videos', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getVideoById(videoId: number) {
        try {
            const video = await this.videoRepository.query('SELECT videoUrl, thumbnailUrl, title FROM video WHERE videoId = ?', [videoId]);

            if (!video || video.length === 0) {
                throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
            }

            return {
                status: HttpStatus.OK,
                message: 'Video fetched successfully',
                data: video,
            };
        } catch (error) {
            throw new HttpException('Error fetching video', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async searchVideosByTitle(title: string) {
        try {
            const [videos] = await this.videoRepository.query('SELECT videoUrl, thumbnailUrl, title FROM video WHERE title LIKE ?', [`%${title}%`]);

            return {
                status: HttpStatus.OK,
                message: 'Videos fetched successfully',
                data: videos,
            };
        } catch (error) {
            throw new HttpException('Error searching videos', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
