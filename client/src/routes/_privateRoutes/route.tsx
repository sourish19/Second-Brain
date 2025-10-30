import { createFileRoute, Outlet } from '@tanstack/react-router';

import AuthLayout from '@/layouts/AuthLayout';

export const Route = createFileRoute('/_privateRoutes')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}
