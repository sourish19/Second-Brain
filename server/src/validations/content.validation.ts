import * as z from 'zod';

import { AVAILABLE_CONTENT_TYPES } from '../utils/constants.util';

const titleSchemaValidation = z
  .string()
  .min(4, { message: 'Title must be at least 4 characters' })
  .max(20, { message: 'Title must be at most 20 characters ' });

const linkSchemaValidation = z.string({
  message: 'Link is required',
});

const contentTypeEnum: string[] = AVAILABLE_CONTENT_TYPES;
const contentTypeSchemaValidation = z.optional(
  z.enum(contentTypeEnum, {
    message: `Expected one of ${contentTypeEnum.join(', ')} content types`,
  })
);

const tagsSchemaValidation = z.optional(z.array(z.string()));

export const contentSchemaValidation = z.object({
  title: titleSchemaValidation,
  link: linkSchemaValidation,
  type: contentTypeSchemaValidation,
  tags: tagsSchemaValidation,
});

export const contentIdValidation = z.object({
  contentId: z.string({ message: 'Content ID is required' }),
});
