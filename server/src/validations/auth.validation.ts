import * as z from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(3).max(10),
  email: z.email().trim().toLowerCase(),
});

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(20)
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
