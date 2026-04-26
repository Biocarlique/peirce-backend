import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHypothesisDto } from './dto/hypothesis.dto';

@Injectable()
export class HypothesisService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, data: CreateHypothesisDto) {
        const observation = await this.prisma.observation.findFirst({
            where: { id: data.observationId, userId },
        });

        if (!observation) throw new NotFoundException('Observation not found');

        return this.prisma.hypothesis.create({
            data: {
                observationId: data.observationId,
                explanation: data.explanation,
                solution: data.solution,
                successCondition: data.successCondition,
                failCondition: data.failCondition,
                preparation: data.preparation,
                heuristic: data.heuristic,
                minDays: data.minDays ?? 7,
                maxFailures: data.maxFailures ?? 2,
                maxSkips: data.maxSkips ?? 2,
                targetWinRate: data.targetWinRate ?? 80,
            },
        });
    }

    async findAllByUserId(userId: string) {
        return this.prisma.hypothesis.findMany({
            where: {
                observation: { userId },
            },
            include: {
                observation: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(userId: string, hypothesisId: string) {
        return this.prisma.hypothesis.findFirst({
            where: {
                id: hypothesisId,
                observation: { userId },
            },
        });
    }
}
