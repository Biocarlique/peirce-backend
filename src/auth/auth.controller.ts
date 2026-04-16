import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthSchema } from './dto/auth.dto';
import type { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @UsePipes(new ZodValidationPipe(AuthSchema))
    async register(@Body() body: AuthDto) {
        // @Body() retrieves data (JSON from client) from the request body and puts it to the 'body' parameter
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(AuthSchema))
    async login(@Body() body: AuthDto) {
        return this.authService.login(body.email, body.password);
    }
}
