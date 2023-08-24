import { Body, Controller, Post, Get, Query } from "@nestjs/common";
import { UserService } from "src/services/user.service";



@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Post('signup')
    createUser(@Body() userInfo: { user_name: string, user_email: string, password: string }) {
        return this.userService.signUpUser(userInfo)
    }

    @Get('login')
    loginUser(@Query('user_email') email: string, @Query('password') password: string) {
        return this.userService.validateUser(email, password);
    }
    
}