import { Controller, Get, Param, Query } from '@nestjs/common';
import { VideoService } from 'src/services/videos.service';

@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Get()
    getAllVideos(@Query('page') page: number, @Query('limit') limit: number, @Query('userId') userId: number) {
        return this.videoService.getAllVideos(page, limit, userId);
    }

    @Get(':id')
    getVideoById(@Param('id') id: number) {
        return this.videoService.getVideoById(id);
    }

    @Get('search')
    searchVideosByTitle(@Query('title') title: string) {
        return this.videoService.searchVideosByTitle(title);
    }
}
