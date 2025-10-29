import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NavLinksConstants } from '@/constants/appConstants';
import useHeaderScroll from '@/hooks/useHeaderScroll';

const Header = () => {
	const [open, setOpen] = useState(false);

	const scrolled = useHeaderScroll();

	return (
		<header
			className={`sticky top-0 z-50 w-full text-neutral-100  px-4 md:px-8 font-poppins ${scrolled ? 'backdrop-blur-md  border-b border-neutral-700' : 'bg-transparent'}  `}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
				{/* Left side */}

				<div className="text-xl md:text-2xl  text-neutral-100 tracking-wide  bg-clip-textdrop-shadow-lg font-bitcount">
					SecondBrain
				</div>

				{/* Desktop Nav */}
				<NavigationMenu className="hidden cursor-pointer md:flex">
					<NavigationMenuList className="flex gap-4">
						{NavLinksConstants.map((link, i) => (
							<NavigationMenuItem key={i}>
								<button
									type="button"
									className="rounded-md px-3 py-2 text-sm font-medium cursor-pointer  hover:bg-accent hover:text-accent-foreground transition"
								>
									{link}
								</button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>

				{/* Right side (buttons) */}
				<div className="hidden  md:flex gap-3">
					<Button className="cursor-pointer" variant="ghost" size="sm">
						Sign In
					</Button>
					<Button className="cursor-pointer" size="sm">
						Get Started
					</Button>
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
							{NavLinksConstants.map((link, i) => (
								<button
									type="button"
									key={i}
									className="w-full rounded-md px-3 py-2 text-left text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition"
								>
									{link}
								</button>
							))}
							<div className="border-t my-2"></div>
							<Button variant="ghost" size="sm" className="w-full">
								Sign In
							</Button>
							<Button size="sm" className="w-full">
								Get Started
							</Button>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</header>
	);
};

export default Header;
