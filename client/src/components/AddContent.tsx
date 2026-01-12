import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
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
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import type { AddContentValues } from '@/validations/contentValidation';
import { AddContentSchema } from '@/validations/contentValidation';
import { addContent } from '@/api/contents';

const AddContent = () => {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (formData: AddContentValues) => {
			const data = await addContent(formData);

			if (data instanceof Object) {
				queryClient.invalidateQueries({ queryKey: ['contents'] });
				toast.success(data.message);
				form.reset();
				setOpen(false);
			} else {
				toast.error(data);
			}
			return data;
		},
	});
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
			// console.log('Form data:', value);
			mutation.mutate(value);
		},
	});

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline">Add Content</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add Content</SheetTitle>
					<SheetDescription>
						<p>Fill the form to add a new content to your SecondBrain</p>
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
						{/* // This is for Title Field  */}
						<form.Field
							name="title"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="px-5">
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter the Title"
											autoComplete="off"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
						{/* This is for link */}
						<form.Field
							name="link"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="px-5">
										<FieldLabel htmlFor={field.name}>Link</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Enter the Link"
											autoComplete="off"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
						{/* This is for type */}
						<form.Field
							name="type"
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="px-5">
										<FieldLabel htmlFor={field.name}>Type</FieldLabel>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={field.handleChange}
											aria-invalid={isInvalid}
										>
											<SelectTrigger id={field.name}>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="document">Document</SelectItem>
												<SelectItem value="tweet">Tweet</SelectItem>
												<SelectItem value="video">Video</SelectItem>
												<SelectItem value="link">Link</SelectItem>
												<SelectItem value="other">Other</SelectItem>
											</SelectContent>
										</Select>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
						{/* This is for tags */}
						<form.Field name="tags" mode="array">
							{(field) => (
								<Field className="px-5">
									<FieldLabel>Tags</FieldLabel>

									<div className="space-y-2">
										{field.state.value.map((_, index) => (
											<form.Field key={index} name={`tags[${index}]`}>
												{(tagField) => {
													const isInvalid =
														tagField.state.meta.isTouched && !tagField.state.meta.isValid;

													return (
														<div className="flex gap-2 items-start">
															<Input
																value={tagField.state.value}
																onBlur={tagField.handleBlur}
																onChange={(e) => tagField.handleChange(e.target.value)}
																placeholder="Enter tag"
																aria-invalid={isInvalid}
																autoComplete="off"
															/>

															<button
																type="button"
																onClick={() => field.removeValue(index)}
																className="text-sm text-red-500"
																aria-label={`Remove tag ${index + 1}`}
															>
																✕
															</button>

															{isInvalid && <FieldError errors={tagField.state.meta.errors} />}
														</div>
													);
												}}
											</form.Field>
										))}
									</div>

									<Button
										type="button"
										onClick={() => field.pushValue('')}
										// className="mt-2 text-sm "
										disabled={field.state.value.length >= 3}
									>
										+ Add tag
									</Button>
								</Field>
							)}
						</form.Field>
					</FieldSet>

					<SheetFooter>
						<Button type="submit">{mutation.isPending ? <Spinner /> : 'Save'}</Button>
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
