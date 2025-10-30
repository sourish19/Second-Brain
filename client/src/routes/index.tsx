import { createFileRoute } from '@tanstack/react-router';
import { HeroSection, Feature, Footer } from '@/components';
import AppLayout from '@/layouts/AppLayout';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AppLayout>
			<div className="flex flex-col w-full h-full">
				<HeroSection />
				<Feature />
				<Footer />
			</div>
		</AppLayout>
	);
}
