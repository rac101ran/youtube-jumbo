import { Injectable, HttpStatus, NotFoundException, InternalServerErrorException, BadRequestException, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/repository/user";
import { Video } from "src/repository/video";
import { Repository } from "typeorm";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        @InjectRepository(Video) private videoRepository: Repository<Video>,
    ) { }

    async addVideoToWatchLater(userId: number, videoId: string): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['watchLaterVideos'] });
            const video = await this.videoRepository.findOne({ where: { videoId } });
            if (!user) {
                throw new NotFoundException('User not found.');
            }

            if (!video) {
                throw new NotFoundException('Video not found.');
            }

            const existingVideo = user.watchLaterVideos.find(video => video.videoId === videoId);

            if (existingVideo) {
                throw new BadRequestException({
                    code: HttpStatus.BAD_REQUEST,
                    message: 'Video is already in the watch later list.',
                    data: [],
                });
            } else {
                user.watchLaterVideos.push(video);
                await this.userRepository.save(user);
                return {
                    code: HttpStatus.CREATED,
                    message: 'Video added to watch later list.',
                };
            }
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException('An error occurred while adding the video to watch later.');
            }
        }
    }

    async getWatchLaterList(userId: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['watchLaterVideos'] });

            if (!user) {
                throw new NotFoundException('User not found.');
            }

            return {
                status: HttpStatus.OK,
                data: user.watchLaterVideos,
                message: "all watch list videos"
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new InternalServerErrorException('An error occurred while fetching the watch later list.');
            }
        }
    }

    async removeVideoFromWatchLater(userId: number, videoId: string): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['watchLaterVideos'] });

            if (!user) {
                throw new NotFoundException('User not found.');
            }
            user.watchLaterVideos = user.watchLaterVideos.filter(video => video.videoId !== videoId);
            await this.userRepository.save(user);
            return {
                status: HttpStatus.OK,
                message: "video deleted/not present"
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new InternalServerErrorException('An error occurred while removing the video from watch later.');
            }
        }
    }
}