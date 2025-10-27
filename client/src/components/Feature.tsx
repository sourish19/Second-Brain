import { FeaturesConstants } from '@/constants/appConstants';

const Feature = () => {
	return (
		<section className="py-25 mx-auto max-w-7xl">
			<div className="container">
				{/* Features Heading*/}
				<div className="mb-24 flex flex-col items-center gap-6">
					<h1 className="text-center text-3xl font-semibold lg:max-w-3xl lg:text-5xl">
						{FeaturesConstants.title}
					</h1>
					<p className="text-muted-foreground text-center text-lg font-medium md:max-w-4xl lg:text-xl">
						{FeaturesConstants.description}
					</p>
				</div>

				<div className="relative flex justify-center">
					<div className=" relative flex w-full flex-col border border-neutral-700 md:w-1/2 lg:w-full">
						{/* First Row of Features */}
						<div className="relative flex flex-col lg:flex-row">
							{/* Feature 1 */}
							<div className="flex flex-col justify-between border-b border-solid p-10 lg:w-3/5 lg:border-b-0 lg:border-r border-neutral-700">
								<div className="flex items-center gap-2">
									<FeaturesConstants.feature1.image />
									<h2 className="text-xl font-semibold">{FeaturesConstants.feature1.title}</h2>
								</div>
								<p className="text-muted-foreground">{FeaturesConstants.feature1.description}</p>
							</div>
							{/* Feature 2 */}
							<div className="flex flex-col justify-between p-10 lg:w-2/5">
								<div className="flex items-center gap-2">
									<FeaturesConstants.feature2.image />
									<h2 className="text-xl font-semibold">{FeaturesConstants.feature2.title}</h2>
								</div>
								<p className="text-muted-foreground">{FeaturesConstants.feature2.description}</p>
							</div>
						</div>
						{/* Second Row of Features */}
						<div className="border-neutral-700 elative flex flex-col border-t border-solid lg:flex-row">
							{/* Feature 3 */}
							<div className="border-neutral-700 flex flex-col justify-between border-b border-solid p-10 lg:w-2/5 lg:border-b-0 lg:border-r">
								<div className="flex items-center gap-2">
									<FeaturesConstants.feature3.image />
									<h2 className="text-xl font-semibold">{FeaturesConstants.feature3.title}</h2>
								</div>
								<p className="text-muted-foreground">{FeaturesConstants.feature3.description}</p>
							</div>
							{/* Feature 4 */}
							<div className="flex flex-col justify-between p-10 lg:w-3/5">
								<div className="flex items-center gap-2">
									<FeaturesConstants.feature4.image />
									<h2 className="text-xl font-semibold">{FeaturesConstants.feature4.title}</h2>
								</div>
								<p className="text-muted-foreground">{FeaturesConstants.feature4.description}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Feature;
