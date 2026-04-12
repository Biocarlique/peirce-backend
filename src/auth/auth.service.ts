import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(email: string, password: string) {
        // 1. Check, whether such user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            // NestJS will single-handedly transform an error into a 400 Bad Request
            throw new BadRequestException(
                'The user with this email already exists',
            );
        }

        // 2. Hashing a password (salt = level 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Saving a new user to DB
        const user = await this.prisma.user.create({
            data: {
                email: email,
                passwordHash: hashedPassword,
            },
        });

        // 4. Returning user's data, but without a password
        return {
            id: user.id,
            email: user.email,
        };
    }

    async login(email: string, password: string) {
        // 1. Find user by email
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            throw new UnauthorizedException(
                "A user with this email doesn't exist",
            );
        }

        // 2. Compare passwords
        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong password');
        }

        // 3. Generate JWT
        const payload = { sub: user.id, email: user.email };

        return {
            accessToken: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
}
