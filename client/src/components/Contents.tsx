// import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Shimmer, ErrorFallback } from '.';

// import { userStore } from '@/store/store';
import { getContents } from '@/api/contents';
import { CardContents } from '.';

const Contents = () => {
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ['contents'],
		queryFn: getContents,
	});

	// const sideNavigationType = userStore((state) => state.sideNavigationType);

	// useEffect(() => {}, [sideNavigationType]);

	if (isLoading) {
		return (
			<div className="flex-1 ml-15 md:ml-40 p-4 h-screen">
				<Shimmer />
			</div>
		);
	}

	if (isError) {
		if (error instanceof Error)
			return (
				<div className="flex-1 ml-15 md:ml-40 p-4 h-screen">
					<ErrorFallback message={error.message}/>
				</div>
			);
	}

	if (data && typeof data === 'object') {
		return (
			<div className="flex-1 ml-15 md:ml-40 p-4 h-screen">
				<CardContents data={data.data} />
			</div>
		);
	}
};

export default Contents;
