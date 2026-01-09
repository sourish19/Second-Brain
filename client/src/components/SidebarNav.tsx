import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { logoutUser } from '@/api/auth';
import type { TSideNavbarTypes } from '@/constants/appConstants';
import { SidebarNavbarContents } from '@/constants/appConstants';
import { setSideNavigationType } from '@/store/store';
import { Button } from './ui/button';

const SidebarNav = () => {
	const navigate = useNavigate({ from: '/dashboard' });
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: logoutUser,
		onSuccess: async (data) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['user'] }),
				queryClient.invalidateQueries({ queryKey: ['contents'] }),
			]);
			if (typeof data === 'object') toast.success(data.message);
			navigate({ to: '/' });
		},
		onError: (error) => {
			error instanceof Error && toast.error(error.message);
		},
	});

	const handleClick = (title: TSideNavbarTypes) => {
		setSideNavigationType(title);
	};

	return (
		<aside className="flex flex-col fixed h-full w-15 md:w-40 border-r border-neutral-700 text-neutral-900 dark:text-neutral-100">
			<div className="flex-5 py-5 px-4 md:px-4 flex flex-col  gap-6">
				{SidebarNavbarContents.map((item, index) => (
					<Button
						variant={'ghost'}
						key={index}
						className="flex gap-2 cursor-pointer"
						onClick={() => handleClick(item.title)}
					>
						<span>{item.icon}</span>
						<span className="hidden md:block">{item.title}</span>
					</Button>
				))}
			</div>
			<div className="flex-1 flex py-5 px-4 md:px-4 ">
				<Button
					onClick={() => mutation.mutate()}
					variant={'ghost'}
					className="py-1 cursor-pointer flex gap-2 "
				>
					<span>
						{' '}
						<LogOut />{' '}
					</span>
					<span className="hidden md:block">Logout</span>
				</Button>
			</div>
		</aside>
	);
};

export default SidebarNav;
