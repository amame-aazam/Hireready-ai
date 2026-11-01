import { z } from 'zod';

export const assessmentDomainParamSchema = z.object({
  domainId: z.string().min(1, 'Domain ID or slug is required'),
});

export const startAssessmentParamSchema = z.object({
  id: z.string().uuid('Invalid assessment ID'),
});

export const attemptParamSchema = z.object({
  attemptId: z.string().uuid('Invalid attempt ID'),
});

export const autosaveAssessmentSchema = z.object({
  answers: z.object({
    mcq: z.record(z.string(), z.number()).default({}),
    code: z
      .record(
        z.string(),
        z.object({
          code: z.string(),
          language: z.string().default('javascript'),
        })
      )
      .default({}),
  }),
});

export const runCodeSchema = z.object({
  questionId: z.string().uuid('Invalid question ID'),
  sourceCode: z.string().min(1, 'Source code cannot be empty'),
  language: z.string().default('javascript'),
});

export type AutosaveAssessmentInput = z.infer<typeof autosaveAssessmentSchema>;
export type RunCodeInput = z.infer<typeof runCodeSchema>;
