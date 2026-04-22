import { z } from 'zod';

export const CreateObservationSchema = z.object({
    situation: z.string().min(1, 'Situation is required'),
    trigger: z.string().min(1, 'Trigger is required'),
    thoughts: z.string().min(1, 'Thoughts are required'),
    emotions: z.string().min(1, 'Emotions are required'),
    actions: z.string().min(1, 'Actions are required'),
    consequences: z.string().min(1, 'Consequences are required'),
});

export type CreateObservationDto = z.infer<typeof CreateObservationSchema>;
