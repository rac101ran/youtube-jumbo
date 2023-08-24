import { Controller, Get, Param, Post, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { Video } from 'src/repository/video'; // Adjust the import path based on your project structure
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/services/customer.service';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Import your JWTAuthGuard

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    @Post(':userId/watch-later/:videoId')
    // @UseGuards(JwtAuthGuard) // Apply JWT authentication guard
    async addVideoToWatchLater(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('videoId') videoId: string
    ): Promise<void> {
        return await this.customerService.addVideoToWatchLater(userId, videoId);
    }

    @Get(':userId/watch-later/all')
    // @UseGuards(JwtAuthGuard) // Apply JWT authentication guard
    async getWatchLaterList(@Param('userId', ParseIntPipe) userId: number): Promise<any> {
        return this.customerService.getWatchLaterList(userId);
    }

    @Post(':userId/delete-watch-later/:videoId')
    // @UseGuards(JwtAuthGuard) // Apply JWT authentication guard
    async removeVideoFromWatchLater(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('videoId') videoId: string
    ): Promise<any> {
        return await this.customerService.removeVideoFromWatchLater(userId, videoId);
    }
}