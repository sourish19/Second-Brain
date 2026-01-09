import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components';
import { Spinner } from '@/components/ui/spinner';
import useGetUser from '@/hooks/useGetUser';

type Prop = {
	children: React.ReactElement | React.ReactElement[];
};

const AuthLayout = ({ children }: Prop) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { isLoading, isError, data, error } = useGetUser();

	useEffect(() => {
		if (isError) {
			queryClient.removeQueries({
				queryKey: ['user'],
			});
			toast.error(error instanceof Error ? error.message : 'You are not logged in');
			navigate({ to: '/signin' });
		}
	}, [isError, error, navigate]);

	if (isLoading) {
		return (
			<div className="dark:bg-neutral-950 text-neutral-100 min-h-screen w-full font-inter">
				<Header />
				<div className="w-full flex items-center justify-center h-screen">
					<Spinner className="size-15" />
				</div>
			</div>
		);
	}

	if (data && data.success) {
		return (
			<div className="dark:bg-neutral-950 text-neutral-100 min-h-screen w-full font-inter">
				<Header />
				<div className="w-full">{children}</div>
			</div>
		);
	}

	return;
};

export default AuthLayout;
