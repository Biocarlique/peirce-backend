import {
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        // Trying to parse data against the provided Zod schema
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException({
                    statusCode: 400,
                    message: 'Validation failed',
                    errors: error.issues.map(issue => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
            }
            throw new BadRequestException(error);
        }
    }
}
