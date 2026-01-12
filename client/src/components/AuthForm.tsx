import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import type { AuthFormProps } from '@/constants/appConstants';

const AuthForm = <TResponse, TVariables>({
	title,
	description,
	fields,
	type,
	action,
	navigate,
	form: formApi,
	mutation,
}: AuthFormProps<TResponse, TVariables>) => {
	return (
		<Card className="w-75 lg:w-full max-w-md px-2 sm:px-6">
			<CardHeader className="">
				<CardTitle className=" ">{title}</CardTitle>
				<CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
				<CardAction>
					<Button variant="link" className="text-xs sm:text-sm px-0">
						<Link to={navigate}>{action}</Link>
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						formApi.handleSubmit();
					}}
				>
					<FieldSet>
						<FieldGroup>
							{fields.map((fieldName, index) => (
								<formApi.Field key={index} name={fieldName.toLowerCase()}>
									{(field) => {
										const name = field.name;
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={name} className="text-xs sm:text-sm">
													{field.name.toLocaleUpperCase()}
												</FieldLabel>
												<Input
													id={name}
													name={name}
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													aria-invalid={isInvalid}
													type={name.includes('password') ? 'password' : 'text'}
													placeholder={
														name.includes('email')
															? 'jhondoe@example.com'
															: name.includes('password')
																? '********'
																: 'John Doe'
													}
													className="text-xs sm:text-sm"
												/>
												{isInvalid && <FieldError errors={field.state.meta.errors} />}
											</Field>
										);
									}}
								</formApi.Field>
							))}
						</FieldGroup>
					</FieldSet>

					<Button type="submit" className="w-full mt-5 text-xs sm:text-sm">
						{mutation.isPending ? <Spinner /> : type}
					</Button>
				</form>
			</CardContent>

			<CardFooter>
				<Button
				onClick={() => (window.location.href = `${import.meta.env.VITE_DEV_BASE_URL}/users/google`)}
				variant="outline" className="w-full text-xs sm:text-sm">
					Login with Google
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AuthForm;
