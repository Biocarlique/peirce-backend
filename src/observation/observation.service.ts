import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObservationDto } from './dto/observation.dto';

@Injectable()
export class ObservationService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, data: CreateObservationDto) {
        return this.prisma.observation.create({
            data: {
                userId,
                situation: data.situation,
                trigger: data.trigger,
                thoughts: data.thoughts,
                emotions: data.emotions,
                actions: data.actions,
                consequences: data.consequences,
            },
        });
    }

    async findAllByUserId(userId: string) {
        return this.prisma.observation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
