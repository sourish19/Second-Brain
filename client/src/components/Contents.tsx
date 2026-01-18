import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';

import { getContents } from '@/api/contents';

import { CardContents, ErrorFallback, Shimmer,NoContent } from '.';
import { userStore } from '@/store/store';

const Contents = () => {
	const filteredValue = useStore(userStore, (state) => state.sideNavigationTypeValue);

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
		return (
			<div className="flex-1 ml-15 mt-16 md:ml-40 p-4 h-screen">
				<div className='flex flex-wrap gap-4'>
					{
						data.data.map(item => {
							if(filteredValue === 'all' || filteredValue === item.type){
								return <CardContents data={item} />
							}
						})
					}
				</div>
			</div>
		);
	} else {
		return (
<NoContent />
		);
	}
};

export default Contents;
