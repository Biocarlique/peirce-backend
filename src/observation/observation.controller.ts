import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ObservationService } from './observation.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateObservationSchema } from './dto/observation.dto';
import type { CreateObservationDto } from './dto/observation.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('observations')
@UseGuards(JwtAuthGuard)
export class ObservationController {
    constructor(private readonly observationService: ObservationService) {}

    @Post()
    async create(
        @CurrentUser('sub') userId: string,
        @Body(new ZodValidationPipe(CreateObservationSchema))
        body: CreateObservationDto,
    ) {
        return this.observationService.create(userId, body);
    }

    @Get()
    async findAll(@CurrentUser('sub') userId: string) {
        return this.observationService.findAllByUserId(userId);
    }
}
