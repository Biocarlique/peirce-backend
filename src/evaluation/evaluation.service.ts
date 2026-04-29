import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HypothesisStatus } from '../generated/prisma/client/enums';

@Injectable()
export class EvaluationService {
    constructor(private readonly prisma: PrismaService) {}

    async evaluateHypothesis(hypothesisId: string) {
        const hypothesis = await this.prisma.hypothesis.findUnique({
            where: { id: hypothesisId },
            include: {
                observation: true,
                trackingEntries: {
                    orderBy: { date: 'asc' },
                },
            },
        });

        if (!hypothesis || hypothesis.status !== 'TESTING') return;

        const entries = hypothesis.trackingEntries;
        if (entries.length === 0) return;

        // Calculate elapsed days (from the first entry to the latest)
        const firstDate = new Date(entries[0].date).getTime();
        const lastDate = new Date(entries[entries.length - 1].date).getTime();
        const millisecsInOneDay = 1000 * 60 * 60 * 24;
        const elapsedDays = Math.floor(
            (lastDate - firstDate) / millisecsInOneDay + 1,
        );

        // Calculate Win Rate and Consecutive Failures
        let validAttempts = 0;
        let successfulAttempts = 0;
        let consecutiveFailures = 0;

        for (const entry of entries) {
            if (entry.attemptMade) {
                validAttempts++;
                if (entry.isSuccess) {
                    successfulAttempts++;
                    consecutiveFailures = 0;
                } else if (!entry.isExternalFactor) {
                    consecutiveFailures++;
                }
            }
        }

        const winRate =
            validAttempts > 0 ? (successfulAttempts / validAttempts) * 100 : 0;

        // Calculate Skips in the last 7 days
        const sevenDaysAgo = new Date(lastDate);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const skipsInLastWeek = entries
            .filter(e => new Date(e.date) >= sevenDaysAgo)
            .filter(e => !e.attemptMade && !e.isExternalFactor).length;

        // Determine new status
        let newStatus: HypothesisStatus = 'TESTING';
        const maxDays = hypothesis.minDays * 2;

        // Condition 1: Failed due to too many consecutive failures or skips
        if (
            consecutiveFailures > hypothesis.maxFailures ||
            skipsInLastWeek > hypothesis.maxSkips
        ) {
            newStatus = 'REFUTED';
        }
        // Condition 2: Time is up, but win rate is too low
        else if (elapsedDays > maxDays && winRate < hypothesis.targetWinRate) {
            newStatus = 'REFUTED';
        }
        // Condition 3: Success! All criteria met at the same moment
        else if (
            elapsedDays >= hypothesis.minDays &&
            consecutiveFailures <= hypothesis.maxFailures &&
            skipsInLastWeek <= hypothesis.maxSkips &&
            winRate >= hypothesis.targetWinRate
        ) {
            newStatus = 'SUCCESS';
        }

        // Apply changes if status changed
        if (newStatus !== 'TESTING') {
            const operations: any[] = [
                this.prisma.hypothesis.update({
                    where: { id: hypothesis.id },
                    data: { status: newStatus },
                }),
            ];

            if (newStatus === 'SUCCESS') {
                operations.push(
                    this.prisma.successVault.create({
                        data: {
                            userId: hypothesis.observation.userId,
                            hypothesisId: hypothesis.id,
                            heuristicText: hypothesis.heuristic,
                        },
                    }),
                );
            }

            await this.prisma.$transaction(operations);
        }
    }
}
