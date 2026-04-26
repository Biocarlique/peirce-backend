import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { HypothesisService } from './hypothesis.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateHypothesisSchema } from './dto/hypothesis.dto';
import type { CreateHypothesisDto } from './dto/hypothesis.dto';

@Controller('hypotheses')
@UseGuards(JwtAuthGuard)
export class HypothesisController {
    constructor(private readonly hypothesisService: HypothesisService) {}

    @Post()
    async create(
        @CurrentUser('sub') userId: string,
        @Body(new ZodValidationPipe(CreateHypothesisSchema))
        body: CreateHypothesisDto,
    ) {
        return this.hypothesisService.create(userId, body);
    }

    @Get()
    async findAll(@CurrentUser('sub') userId: string) {
        return this.hypothesisService.findAllByUserId(userId);
    }
}
