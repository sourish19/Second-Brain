import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { userStore } from '@/store/store';
import { getContents } from '@/api/contents';

const Contents = () => {
	const { isPending, isError, data, error } = useQuery({
		queryKey: ['contents'],
		queryFn: getContents,
	});

	const sideNavigationType = userStore((state) => state.sideNavigationType);

	// useEffect(() => {}, [sideNavigationType]);

	if (isPending) {
		return <span>Loading...</span>;
	}

	if (isError) {
		return <span>Error: {error.message}</span>;
	}

	return <div className="flex-1 ml-15 md:ml-40 p-4 h-screen">{sideNavigationType}</div>;
};

export default Contents;
