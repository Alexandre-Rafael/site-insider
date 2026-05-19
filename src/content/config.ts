import { defineCollection, z } from 'astro:content';

export const CATEGORIAS = [
  'Cases de Sucesso',
  'Marketing Digital',
  'Tráfego Pago',
  'Branding',
  'Bastidores',
] as const;

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    excerpt: z.string().optional(), // resumo para SEO (máx 160 chars), exibido no Google
    cover: z.string(),
    category: z.enum(CATEGORIAS),
    author: z.string().default('Insider Mídia'),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
