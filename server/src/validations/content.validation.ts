import * as z from 'zod';

const titleSchemaValidation = z.object({
  title: z
    .string()
    .min(4, { message: 'Title must be at least 4 characters' })
    .max(20, { message: 'Title must be at most 20 characters ' }),
});

const linkSchemaValidation = z.object({
  link: z.string(),
});

const tagsSchemaValidation = z.object({
  tags: z.array(z.string().optional()),
});

export const contentSchemaValidation = z.object({
  title: titleSchemaValidation,
  link: linkSchemaValidation,
  tags: tagsSchemaValidation,
});
