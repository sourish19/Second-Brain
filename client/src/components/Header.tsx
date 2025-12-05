import { useState } from 'react';
import { Link } from '@tanstack/react-router';

import { Menu, Share2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ModeToggle, AddContent } from '.';

import { NavLinksConstants } from '@/constants/appConstants';
import useHeaderScroll from '@/hooks/useHeaderScroll';
import useGetUser from '@/hooks/useGetUser';
import useScrollToHashSection from '@/hooks/useScrollToHashSection';

const Header = () => {
	const [open, setOpen] = useState(false);

	const scrolled = useHeaderScroll();

	const { data, isLoading } = useGetUser();

	useScrollToHashSection();

	return (
		<header
			className={`sticky top-0 z-50 w-full text-neutral-900 dark:text-neutral-100  px-4 md:px-8 font-poppins ${isLoading ? '' : data && 'border-b border-neutral-700'} ${scrolled ? 'backdrop-blur-md  border-b border-neutral-700' : 'bg-transparent'}  `}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
				{/* Left side */}

				<div className="text-xl md:text-2xl  dark:text-neutral-100 tracking-wide  bg-clip-textdrop-shadow-lg font-bitcount">
					SecondBrain
				</div>

				{/* Desktop Nav */}
				<NavigationMenu className="hidden cursor-pointer md:flex">
					<NavigationMenuList className="flex gap-4">
						{NavLinksConstants.map((nav, i) => (
							<NavigationMenuItem key={i}>
								<button
									type="button"
									className="rounded-md px-3 py-2 text-sm font-medium cursor-pointer  hover:bg-accent hover:text-accent-foreground transition"
								>
									<Link to={nav.navPath}>{nav.navName}</Link>
								</button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>

				{/* Right side (buttons) */}
				<div className="hidden md:flex gap-3">
					<>
						{isLoading ? null : (
							<div>
								{data && data.success ? (
									<Button className="cursor-pointer" variant="ghost" size="sm">
										<p className="flex justify-center items-center gap-2">
											<Share2 />
											<span>Share Brain</span>
										</p>
									</Button>
								) : (
									<Button className="cursor-pointer" variant="ghost" size="sm">
										<Link to="/signin">
											<>Signin</>
										</Link>
									</Button>
								)}
								{data && data.success ? (
									// <Button className="cursor-pointer" size="sm">
										// <p className="flex justify-center items-center gap-1">
											// <Plus />
											<AddContent text='Add Content' title='Add Content'/>
										// </p>
									// </Button>
								) : (
									<Button className="cursor-pointer" size="sm">
										<Link to="/signup">
											<>Get Started</>
										</Link>
									</Button>
								)}
							</div>
						)}
						<ModeToggle />
					</>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setOpen(!open)}
								className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
							>
								<Menu />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" className="mt-2 w-48 p-2  flex flex-col gap-1">
							{NavLinksConstants.map((nav, i) => (
								<button
									type="button"
									key={i}
									className="w-full rounded-md px-3 py-2 text-left text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition"
								>
									<Link to={nav.navPath}>{nav.navName}</Link>
								</button>
							))}
							<div className="border-t my-2"></div>
							<div className="flex flex-col justify-center gap-y-2">
								{isLoading ? null : (
									<>
										<Button className="cursor-pointer" variant="ghost" size="sm">
											{data && data.success ? (
												<p className="flex justify-center items-center gap-2">
													<Share2 />
													<span>Share Brain</span>
												</p>
											) : (
												<Link to="/signin">
													<>Signin</>
												</Link>
											)}
										</Button>
											{data && data.success ? (
										<Button className="cursor-pointer" size="sm">

												<p className="flex justify-center items-center gap-1">
													<Plus />
													<span>Add Content</span>
												</p>
										</Button>

											) : (
										<Button className="cursor-pointer" size="sm">

												<Link to="/signup">
													<>Get Started</>
												</Link>
										</Button>
											)}
										<ModeToggle />
									</>
								)}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</header>
	);
};

export default Header;
