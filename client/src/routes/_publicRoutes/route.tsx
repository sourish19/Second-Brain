import { createFileRoute, Outlet } from '@tanstack/react-router';

import AppLayout from '@/layouts/AppLayout';

export const Route = createFileRoute('/_publicRoutes')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
