import { Controller, Get, Param, Post, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { CustomerService } from 'src/services/customer.service';


@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    @Post(':userId/watch-later/:videoId')
    async addVideoToWatchLater(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('videoId') videoId: string
    ): Promise<void> {
        return await this.customerService.addVideoToWatchLater(userId, videoId);
    }

    @Get(':userId/watch-later/all')
    async getWatchLaterList(@Param('userId', ParseIntPipe) userId: number): Promise<any> {
        return this.customerService.getWatchLaterList(userId);
    }

    @Post(':userId/delete-watch-later/:videoId')
    async removeVideoFromWatchLater(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('videoId') videoId: string
    ): Promise<any> {
        return await this.customerService.removeVideoFromWatchLater(userId, videoId);
    }
}