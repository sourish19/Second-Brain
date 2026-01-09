import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { toast } from 'sonner';
import { registerUser } from '@/api/auth';
import { AuthForm } from '@/components';
import type { TRegsisterResponse, TSignup } from '@/validations/authValidation';
import { SignupValidationSchema } from '@/validations/authValidation';

export const Route = createFileRoute('/_publicRoutes/signup')({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate({ from: '/signup' });

	const mutation = useMutation<TRegsisterResponse | string, unknown, TSignup, unknown>({
		mutationFn: async (formData: TSignup) => {
			const data = await registerUser(formData);

			if (data instanceof Object) {
				toast.success(data.message);
				navigate({ to: '/signin' });
			} else {
				toast.error(data);
			}
			return data;
		},
	});

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
		validators: {
			onSubmit: SignupValidationSchema,
		},
		onSubmit: ({ value }) => {
			console.log('Form data:', value);
			mutation.mutate(value);
		},
	});

	return (
		<div className="flex flex-col h-full pb-20 mt-5 md:mt-20 lg:mt-20 w-full justify-center items-center">
			<AuthForm
				title="Sign Up to your account"
				description="Enter your email below to sign up to your account"
				fields={['Name', 'Email', 'Password']}
				type="Sign Up"
				action="Sign In"
				navigate="/signin"
				form={form}
				mutation={mutation}
			/>
		</div>
	);
}
