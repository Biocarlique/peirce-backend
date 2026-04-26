import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ObservationModule } from './observation/observation.module';
import { HypothesisModule } from './hypothesis/hypothesis.module';

@Module({
  imports: [PrismaModule, AuthModule, ObservationModule, HypothesisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
