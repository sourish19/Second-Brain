import { userStore } from '@/store/store';

const Contents = () => {
	const sideNavigationType = userStore((state) => state.sideNavigationType);

	return <div className="flex-1 ml-15 md:ml-40 p-4 h-screen">{sideNavigationType}</div>;
};

export default Contents;
