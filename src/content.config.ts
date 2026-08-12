import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    period: z.string(),
    type: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['트러블슈팅', '기술 선택', '개념 정리']),
    tags: z.array(z.string()).default([]),
    relatedProject: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, notes };
