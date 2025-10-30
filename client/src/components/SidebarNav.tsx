import { SidebarNavbarContents } from '@/constants/appConstants';
import { setSideNavigationType } from '@/store/store';
import type { TSideNavbarTypes } from '@/constants/appConstants';

const SidebarNav = () => {
	const handleClick = (title: TSideNavbarTypes) => {
		setSideNavigationType(title);
	};

	return (
		<aside className="fixed h-full w-15 md:w-40 border-r border-neutral-700 text-neutral-900 dark:text-neutral-100">
			<div className="py-5 px-4 md:px-4 flex flex-col justify-center gap-10">
				{SidebarNavbarContents.map((item, index) => (
					<div
						key={index}
						className="flex gap-2 cursor-pointer"
						onClick={() => handleClick(item.title)}
					>
						<span>{item.icon}</span>
						<span className="hidden md:block">{item.title}</span>
					</div>
				))}
			</div>
		</aside>
	);
};

export default SidebarNav;
