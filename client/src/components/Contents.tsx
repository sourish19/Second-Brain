import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Spinner } from './ui/spinner';
import {Shimmer} from '.'


import { userStore } from '@/store/store';
import { getContents } from '@/api/contents';
import { CardContents } from '.';

const Contents = () => {
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ['contents'],
		queryFn: getContents,
	});

	const sideNavigationType = userStore((state) => state.sideNavigationType);

	// useEffect(() => {}, [sideNavigationType]);

	if (isLoading) {
			return <div className="flex-1 ml-15 md:ml-40 p-4 h-screen">
				{/* <span className='ml-50 text-red-500 mt-50'>Hello</span> */}
					<Shimmer />
			</div>
	}

	if (isError) {
		return <span>Error: {error.message}</span>;
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
