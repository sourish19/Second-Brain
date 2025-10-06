import * as z from 'zod';

const passwordSchemaValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(20, 'Password must be at most 20 characters')
  .superRefine((val, ctx) => {
    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password must include at least one uppercase letter (A-Z).',
      });
    }
    if (!/[a-z]/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password must include at least one lowercase letter (a-z).',
      });
    }
    if (!/\d/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password must include at least one number (0-9).',
      });
    }
    if (!/[^A-Za-z0-9]/.test(val)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Password must include at least one special character (e.g. !@#$%).',
      });
    }
  });

export const userSchemaValidation = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(10, 'Name must be at most 10 characters'),
  email: z.email({ message: 'Invalid email address' }).trim().toLowerCase(),
  password: passwordSchemaValidation,
});

// // export type registerUserSchema = z.infer<typeof registerUserSchema>
// export type passwordSchema = z.infer<typeof passwordSchema>
