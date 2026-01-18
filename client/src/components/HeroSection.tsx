import { HeroConstants } from '@/constants/appConstants';

const HeroSection = () => {
	return (
		<main className="mt-35 divide-y container mx-auto sm:border px-0 border-t border-b border-neutral-700 dark:text-neutral-100">
			<div className="grid grid-cols-12 divide-x border-neutral-700">
				{Array(12)
					.fill(null)
					.map((_, idx) => (
						<div key={idx} className="col-span-1 aspect-square  border-neutral-700"></div>
					))}
			</div>

			<div className="grid grid-cols-12 divide-x border-neutral-700">
				<div className="col-span-1  border-neutral-700"></div>
				<div className="col-span-10   border-neutral-700 flex flex-col items-center justify-center text-center px-8 py-16 sm:py-24">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-8 mb-4 font-semibold tracking-tight">
						{HeroConstants.title}
					</h1>
					<p className="w-full max-w-2xl text-base sm:text-lg md:text-xl text-pretty text-muted-foreground">
						{HeroConstants.description}
					</p>
				</div>
				<div className="col-span-1  border-neutral-700"></div>
			</div>

			<div className="grid grid-cols-12 divide-x ">
				{Array(12)
					.fill(null)
					.map((_, idx) => (
						<div key={idx} className="col-span-1 aspect-square border-neutral-700"></div>
					))}
			</div>
		</main>
	);
};

export default HeroSection;
