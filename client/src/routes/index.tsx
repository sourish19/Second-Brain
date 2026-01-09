import { createFileRoute } from '@tanstack/react-router';
import { Feature, Footer, HeroSection } from '@/components';
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
