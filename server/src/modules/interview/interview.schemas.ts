import { z } from 'zod';

export const startInterviewSchema = z.object({
  interviewType: z.enum(['DSA', 'HR']).default('DSA'),
  domainSlug: z.string().optional(),
});

export const sessionParamSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
});

export const interviewTurnSchema = z.object({
  utterance: z.string().min(1, 'Utterance cannot be empty'),
  codeSnippet: z.string().optional(),
});

export const runInterviewCodeSchema = z.object({
  sourceCode: z.string().min(1, 'Source code cannot be empty'),
  language: z.string().default('javascript'),
});

export const finishInterviewSchema = z.object({
  finalCode: z.string().optional(),
});

export const advanceQuestionSchema = z.object({
  code: z.string().default(''),
  language: z.string().default('javascript'),
});

export type StartInterviewInput = z.infer<typeof startInterviewSchema>;
export type InterviewTurnInput = z.infer<typeof interviewTurnSchema>;
export type RunInterviewCodeInput = z.infer<typeof runInterviewCodeSchema>;
export type FinishInterviewInput = z.infer<typeof finishInterviewSchema>;
export type AdvanceQuestionInput = z.infer<typeof advanceQuestionSchema>;
