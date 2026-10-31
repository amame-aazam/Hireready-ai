import { z } from 'zod';

export const atsEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    keywordScore: z.number().min(0).max(30),
    impactScore: z.number().min(0).max(30),
    formattingScore: z.number().min(0).max(20),
    skillsScore: z.number().min(0).max(20),
  }),
  atsStrengths: z.array(z.string()).min(1),
  atsWeaknesses: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestedImprovements: z.array(z.string()).min(1),
  extractedSkills: z.array(z.string()).min(1),
});

export const analyzeResumeBodySchema = z.object({
  domainId: z.string().uuid().optional(),
  applicationId: z.string().uuid().optional(),
});

export type AtsEvaluationOutput = z.infer<typeof atsEvaluationSchema>;
