type Prop = {
	children: React.ReactElement | React.ReactElement[];
};

const AppLayout = ({ children }: Prop) => {
	return (
		<div className="bg-black text-neutral-100 min-h-screen w-full font-inter">
			<div className="w-full">{children}</div>
		</div>
	);
};

export default AppLayout;
