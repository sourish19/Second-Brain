import { createFileRoute } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';

import { AuthForm } from '@/components';
import { SigninValidationSchema } from '@/validations/appValidation';

export const Route = createFileRoute('/signin')({
	component: RouteComponent,
});

function RouteComponent() {
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
				form={form}
			/>
		</div>
	);
}
