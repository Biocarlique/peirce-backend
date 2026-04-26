import z from 'zod';

export const CreateHypothesisSchema = z.object({
    observationId: z.uuid('Invalid observation ID format'),

    explanation: z.string().min(1, 'Explanation is required'),
    solution: z.string().min(1, 'Solution is required'),
    successCondition: z.string().min(1, 'Success condition is required'),
    failCondition: z.string().min(1, 'Fail condition is required'),
    preparation: z.string().min(1, 'Preparation is required'),
    heuristic: z.string().min(1, 'Heuristic is required'),

    minDays: z.number().int().positive().optional(),
    maxFailures: z.number().int().positive().optional(),
    maxSkips: z.number().int().positive().optional(),
    targetWinRate: z.number().int().min(1).max(100).optional(),
});

export type CreateHypothesisDto = z.infer<typeof CreateHypothesisSchema>;
