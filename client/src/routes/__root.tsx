import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppLayout from '@/layouts/AppLayout';
import Header from '../components/Header';

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => (
		<QueryClientProvider client={queryClient}>
			<AppLayout>
				<Header />
				<Outlet />
				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<ReactQueryDevtools initialIsOpen={false} />
			</AppLayout>
		</QueryClientProvider>
	),
});
