import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.string(),
    author: z.string(),
    description: z.string(),
    readTime: z.string(),
    lang: z.string().default('en'),
    featured: z.boolean().optional(),
    pair: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
