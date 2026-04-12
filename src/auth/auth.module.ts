import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    providers: [AuthService],
    controllers: [AuthController],

    imports: [
        JwtModule.register({
            global: true, // Makes this module available everywhere
            secret: 'my-super-secret-key-for-project', // TODO: in production, use .env for this!
            signOptions: { expiresIn: '14d' },
        }),
    ],
})
export class AuthModule {}
