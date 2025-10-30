import { createFileRoute } from '@tanstack/react-router';

import { Contents, SidebarNav } from '@/components';

export const Route = createFileRoute('/_privateRoutes/dashboard')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex min-h-screen ">
			<SidebarNav />
			<Contents />
		</main>
	);
}
