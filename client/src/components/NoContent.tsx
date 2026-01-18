const NoContent = () => {
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
};

export default NoContent;
