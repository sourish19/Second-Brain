import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import type { AddContentValues } from '@/validations/contentValidation';

import { AddContentSchema } from '@/validations/contentValidation';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';

const AddContent = () => {
	const form = useForm({
		defaultValues: {
			title: '',
			link: '',
			type: '',
			tags: [] as string[],
		},
		validators: {
			onSubmit: AddContentSchema,
		},
		onSubmit: ({ value }) => {
			console.log('Form data:', value);
			// mutation.mutate(value);
		},
	});

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Add Content</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</SheetDescription>
				</SheetHeader>

				<form
					id="add-content-form"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldSet>
						<FieldGroup>
							// This is for Title Field 
							<form.Field
								name="title"
								children={(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Title</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Login button not working on mobile"
												autoComplete="off"
											/>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							></form.Field>
							// This is for link
							<form.Field
								name="link"
								children={(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Title</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Login button not working on mobile"
												autoComplete="off"
											/>
											{isInvalid && <FieldError errors={field.state.meta.errors} />}
										</Field>
									);
								}}
							></form.Field>
						</FieldGroup>
					</FieldSet>

					<SheetFooter>
						<Button type="submit">Save changes</Button>
						<SheetClose asChild>
							<Button variant="outline">Close</Button>
						</SheetClose>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
};

export default AddContent;
