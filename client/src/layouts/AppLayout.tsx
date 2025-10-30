import { Header } from '@/components';

type Prop = {
	children: React.ReactElement | React.ReactElement[];
};

const AppLayout = ({ children }: Prop) => {
	return (
		<div className="min-h-screen w-full font-inte dark:bg-neutral-950">
			<Header />
			<div className="w-full">{children}</div>
		</div>
	);
};

export default AppLayout;
