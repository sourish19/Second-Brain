import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { loginUser } from '@/api/auth';
import { AuthForm } from '@/components';
import type { TLoginResponse, TSignin } from '@/validations/authValidation';
import { SigninValidationSchema } from '@/validations/authValidation';

export const Route = createFileRoute('/_publicRoutes/signin')({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate({ from: '/signin' });

	const mutation = useMutation<TLoginResponse | string, unknown, TSignin, unknown>({
		mutationFn: async (formData: TSignin) => {
			const data = await loginUser(formData);

			if (data instanceof Object) {
				toast.success(data.message);
				navigate({ to: '/dashboard' });
			} else {
				toast.error(data);
			}
			return data;
		},
	});

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: SigninValidationSchema,
		},
		onSubmit: ({ value }) => {
			console.log('Form data:', value);
			mutation.mutate(value);
		},
	});
	return (
		<div className="flex flex-col w-full h-full pb-20 mt-30 justify-center items-center">
			<AuthForm
				title="Sign In to your account"
				description="Enter your email below to sign in to your account"
				fields={['Email', 'Password']}
				type="Sign In"
				action="Sign Up"
				navigate="/signup"
				form={form}
				mutation={mutation}
			/>
		</div>
	);
}
