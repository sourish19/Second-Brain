import z from 'zod';

export const ContentItemSchema = z.strictObject({
	id: z.string(),
	title: z.string(),
	type: z.string(),
	link: z.string(),
	tags: z.array(z.string()),
	image: z.string(),
});

export const GetContentsResponseSchema = z.strictObject({
	success: z.boolean(),
	status: z.literal(200),
	message: z.string(),
	data: z.array(ContentItemSchema),
});

export const AddContentResponseSchema = z.strictObject({
	success: z.boolean(),
	status: z.literal(201),
	message: z.string(),
	data: ContentItemSchema,
});

export const AddContentSchema = z.object({
	title: z.string(),
	link: z.string().url('Link must be a valid URL'),
	type: z.string().min(1, 'Type is required'),
	tags: z.array(z.string()),
});

export type ContentItem = z.infer<typeof ContentItemSchema>;
export type GetContentsResponse = z.infer<typeof GetContentsResponseSchema>;
export type AddContentResponse = z.infer<typeof AddContentResponseSchema>;
export type AddContentValues = z.infer<typeof AddContentSchema>;
