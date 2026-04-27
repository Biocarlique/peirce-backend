import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackingEntryDto } from './dto/tracking-entry.dto';
import { HypothesisService } from '../hypothesis/hypothesis.service';

@Injectable()
export class TrackingService {
    constructor(
        private prisma: PrismaService,
        private hypothesisService: HypothesisService,
    ) {}

    async create(userId: string, data: CreateTrackingEntryDto) {
        const relatedHypothesis = await this.hypothesisService.findOne(
            userId,
            data.hypothesisId,
        );

        if (!relatedHypothesis)
            throw new NotFoundException('Hypothesis not found');

        return this.prisma.trackingEntry.create({
            data: {
                hypothesisId: data.hypothesisId,
                ...(data.date && { date: data.date }),
                attemptMade: data.attemptMade,
                isSuccess: data.attemptMade ? data.isSuccess : null,
                isExternalFactor: data.isExternalFactor ?? false,
                situationDetails: data.situationDetails,
                notes: data.notes,
            },
        });
    }

    async findAll(userId: string, hypothesisId: string) {
        const relatedHypothesis = await this.prisma.hypothesis.findFirst({
            where: {
                id: hypothesisId,
                observation: { userId },
            },
        });

        if (!relatedHypothesis)
            throw new NotFoundException('Hypothesis not found');

        return this.prisma.trackingEntry.findMany({
            where: { hypothesisId },
            include: { hypothesis: true },
            orderBy: { date: 'desc' },
        });
    }
}
