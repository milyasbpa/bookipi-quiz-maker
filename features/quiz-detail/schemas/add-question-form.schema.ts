import { z } from 'zod';

const baseQuestionSchema = z.object({
  type: z.enum(['mcq', 'short']),
  prompt: z.string().min(5, 'Prompt must be at least 5 characters'),
  position: z.number().int().nonnegative().optional(),
});

export const mcqQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('mcq'),
  options: z
    .array(z.string().min(1, 'Option cannot be empty'))
    .min(2, 'MCQ requires at least 2 options')
    .max(6, 'Maximum 6 options'),
  correctAnswer: z.union([z.number(), z.string()]),
});

export const shortQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('short'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

export const questionSchema = z.discriminatedUnion('type', [
  mcqQuestionSchema,
  shortQuestionSchema,
]);

export type QuestionFormValues = z.infer<typeof questionSchema>;
