import { Module } from '@nestjs/common';
import { HypothesisController } from './hypothesis.controller';
import { HypothesisService } from './hypothesis.service';

@Module({
  controllers: [HypothesisController],
  providers: [HypothesisService]
})
export class HypothesisModule {}
