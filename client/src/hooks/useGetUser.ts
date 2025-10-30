import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/auth';

const useGetUser = () => {
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ['user'],
		queryFn: () => getUser(),
		retry: 0,
	});

	return { isLoading, isError, data, error };
};

export default useGetUser;
