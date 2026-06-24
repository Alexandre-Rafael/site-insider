import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    excerpt: z.string().optional(),
    cover: z.string(),
    coverPosition: z.string().optional(),
    logo: z.string().optional(),
    category: z.string(),
    author: z.string().default('Insider Mídia'),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
