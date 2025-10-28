import { createFileRoute } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';

import { AuthForm } from '@/components';
import { SignupValidationSchema } from '@/validations/appValidation';

export const Route = createFileRoute('/signup')({
	component: RouteComponent,
});

function RouteComponent() {
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
		},
	});

	return (
		<div className="flex flex-col h-full pb-20 mt-10 md:mt-20 lg:mt-30 w-full justify-center items-center">
			<AuthForm
				title="Sign Up to your account"
				description="Enter your email below to sign up to your account"
				fields={['Name', 'Email', 'Password']}
				type="Sign Up"
				action="Sign In"
				form={form}
			/>
		</div>
	);
}
