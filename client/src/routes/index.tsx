import { createFileRoute } from '@tanstack/react-router';
import { HeroSection, Feature, Footer } from '@/components';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col w-full h-full">
			<HeroSection />
			<Feature />
			<Footer />
		</div>
	);
}
