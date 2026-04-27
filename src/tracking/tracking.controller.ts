import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateTrackingEntrySchema } from './dto/tracking-entry.dto';
import type { CreateTrackingEntryDto } from './dto/tracking-entry.dto';

@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) {}

    @Post()
    async create(
        @CurrentUser('sub') userId: string,
        @Body(new ZodValidationPipe(CreateTrackingEntrySchema))
        body: CreateTrackingEntryDto,
    ) {
        return this.trackingService.create(userId, body);
    }

    @Get(':hypothesisId')
    async findAll(
        @CurrentUser('sub') userId: string,
        @Param('hypothesisId', new ParseUUIDPipe()) hypothesisId: string,
    ) {
        return this.trackingService.findAll(userId, hypothesisId);
    }
}
