import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ObservationModule } from './observation/observation.module';
import { HypothesisModule } from './hypothesis/hypothesis.module';
import { TrackingModule } from './tracking/tracking.module';

@Module({
  imports: [PrismaModule, AuthModule, ObservationModule, HypothesisModule, TrackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
