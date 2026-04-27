import z from 'zod';

export const CreateTrackingEntrySchema = z.object({
    hypothesisId: z.uuid('Invalid hypothesis ID format'),
    date: z.coerce.date().optional(),

    attemptMade: z.boolean(),
    isSuccess: z.boolean().nullable().optional(),
    isExternalFactor: z.boolean().default(false),
    situationDetails: z.string().optional(),
    notes: z.string().optional(),
});

export type CreateTrackingEntryDto = z.infer<typeof CreateTrackingEntrySchema>;
