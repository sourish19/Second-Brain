import  z from 'zod';

export const UserValidationSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, { message: 'Name must be at least 3 characters' })
		.max(20, { message: 'Name cannot exceed 20 characters' }),

	email: z.email({ message: 'Invalid email address' }).transform((val) => val.toLowerCase()),

	password: z.string().pipe(
		z
			.string()
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(20, { message: 'Password cannot exceed 20 characters' })
			.refine((password) => /[A-Z]/.test(password), {
				message: 'Password must contain at least one uppercase letter',
			})
			.refine((password) => /[a-z]/.test(password), {
				message: 'Password must contain at least one lowercase letter',
			})
			.refine((password) => /[0-9]/.test(password), {
				message: 'Password must contain at least one number',
			})
			.refine((password) => /[!@#$%^&*]/.test(password), {
				message: 'Password must contain at least one special character',
			}),
	),
});

export const SignupValidationSchema = UserValidationSchema.pick({
	name: true,
	email: true,
	password: true,
});

export const SigninValidationSchema = UserValidationSchema.pick({
	email: true,
	password: true,
});

export type TSignup = z.infer<typeof SignupValidationSchema>;
export type TSignin = z.infer<typeof SigninValidationSchema>;

const AuthResponseSchema = z.object({
	success: z.boolean(),
	status: z.number(),
	message: z.string(),
	data: z.object({
		name: z.string(),
		email: z.string(),
	}),
});

export type TLoginResponse = z.infer<typeof AuthResponseSchema>;
export type TRegsisterResponse = z.infer<typeof AuthResponseSchema>;
