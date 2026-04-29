import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { HypothesisModule } from '../hypothesis/hypothesis.module';
import { EvaluationModule } from '../evaluation/evaluation.module';

@Module({
    providers: [TrackingService],
    controllers: [TrackingController],
    imports: [HypothesisModule, EvaluationModule],
})
export class TrackingModule {}
