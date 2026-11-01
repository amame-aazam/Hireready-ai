import { z } from 'zod';

export const assessmentDomainParamSchema = z.object({
  domainId: z.string().min(1, 'Domain ID or slug is required'),
});

export const startAssessmentParamSchema = z.object({
  id: z.string().min(1, 'Assessment ID is required'),
});

export const attemptParamSchema = z.object({
  attemptId: z.string().min(1, 'Attempt ID is required'),
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
  questionId: z.string().min(1, 'Question ID is required'),
  sourceCode: z.string().min(1, 'Source code cannot be empty'),
  language: z.string().default('javascript'),
});

export type AutosaveAssessmentInput = z.infer<typeof autosaveAssessmentSchema>;
export type RunCodeInput = z.infer<typeof runCodeSchema>;
