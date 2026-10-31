import { z } from 'zod';

export const createDomainSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(2).max(100).trim(),
  description: z.string().min(10).max(500).trim(),
  icon: z.string().optional(),
});

export type CreateDomainInput = z.infer<typeof createDomainSchema>;
