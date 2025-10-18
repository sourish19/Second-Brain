import { z } from 'zod';

const envSchema = z.object({
  PORT: z
    .string()
    .refine((port) => parseInt(port) > 0 && parseInt(port) <= 65535, {
      message: 'invalid PORT number',
    }),

  BASE_URL: z
    .string()
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: 'invalid BASE_URL',
    }),

  DB_URI: z
    .string()
    .refine(
      (uri) => uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'),
      {
        message: 'invalid DB_URI',
      }
    ),

  NODE_ENV: z.enum(['development', 'production']).default('development'),

  JWT_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: 'invalid GOOGLE_CALLBACK_URL',
    }),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().refine((port) => parseInt(port) === 6379, {
    message: 'invalid REDIS_PORT number',
  }),

  LINK_PREVIEW_API: z.string().refine((key) => key.length === 32, {
    message: 'invalid LINK_PREVIEW_API',
  }),
});

// Infer the TS type from the schema
type Env = z.infer<typeof envSchema>;

// Zod will validate process.env object
const ENV: Env = envSchema.parse(process.env);

export default ENV;
