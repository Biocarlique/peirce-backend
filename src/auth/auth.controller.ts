import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: any) {
        // @Body() retrieves data (JSON from client) from the request body and puts it to the 'body' parameter
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: any) {
        return this.authService.login(body.email, body.password);
    }
}
