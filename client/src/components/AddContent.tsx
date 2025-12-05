import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

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
import { toast } from 'sonner';

import { AddContentSchema } from '@/validations/contentValidation';
import type { AddContentValues } from '@/validations/contentValidation';

const AddContent = ({title,link,type,tags}: AddContentValues) => {

	const form = useForm({
		defaultValues:{
			title: '',
			link: '',
			type: '',
			tags: [] as string[],
		},
		validators:{
			onSubmit: AddContentSchema
		},
		onSubmit: ({ value }) => {
			console.log('Form data:', value);
			// mutation.mutate(value);
		},
	})

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

		


				{/* <div className="grid flex-1 auto-rows-min gap-6 px-4">
					<div className="grid gap-3">
						<Label htmlFor="sheet-demo-name">Name</Label>
						<Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="sheet-demo-username">Username</Label>
						<Input id="sheet-demo-username" defaultValue="@peduarte" />
					</div>
				</div> */}
				<SheetFooter>
					<Button type="submit">Save changes</Button>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default AddContent;
