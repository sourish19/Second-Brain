import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';

import { getContents } from '@/api/contents';

import { CardContents, ErrorFallback, Shimmer } from '.';
import { userStore } from '@/store/store';

const Contents = () => {
	const filteredValue = useStore(userStore, (state) => state.sideNavigationTypeValue);
	console.log(filteredValue);
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ['contents'],
		queryFn: getContents,
	});

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
					<ErrorFallback message={error.message} />
				</div>
			);
	}

	if (data && typeof data === 'object') {
		console.log(data);

		return (
			<div className="flex-1 ml-15 md:ml-40 p-4 h-screen">
				<CardContents data={data.data} filteredValue={filteredValue} />
			</div>
		);
	} else {
		return (
			<div className="flex-1 ml-15 md:ml-40 p-4 h-screen">
				<div className="flex h-full flex-col items-center justify-center text-center">
					<h2 className="text-lg font-semibold text-zinc-200">No content found</h2>
					<p className="mt-2 max-w-sm text-sm text-zinc-400">
						Your second brain is empty. Start saving tweets, videos, documents, or links to see them
						here.
					</p>
				</div>
			</div>
		);
	}
};

export default Contents;
