"use client";

import { NavProps } from "@/types/nav";
import JiraLogo from "@/components/ui/icons/JiraLogo";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import Button from "@/components/ui/Button";
import AddIcon from "@/components/ui/icons/AddIcon";
import MoreIcon from "@/components/ui/icons/MoreIcon";
import MenuIcon from "@/components/ui/icons/MenuIcon";
import MoreMenu from "./MoreMenu";
import { useNavigationStore } from "@/lib/stores";

export default function MobileNavbar({ className }: NavProps) {
	const { isMoreMenuOpen, toggleMoreMenu, isMobileNavOpen, toggleMobileNav } =
		useNavigationStore();

	return (
		<div className={`${className} w-full flex items-center`}>
			<div className="h-full w-full flex items-center gap-3">
				{/* Menu Toggle Button */}
				<button
					onClick={toggleMobileNav}
					className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-[7px] lg:hidden"
				>
					<MenuIcon
						height={24}
						width={24}
						className="h-full w-full"
						fill="var(--text-subtle)"
					/>
				</button>

				<JiraLogo />

				{/* Search Icon */}
				<button className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-[7px]">
					<SearchIcon
						height={24}
						width={24}
						className="h-full w-full"
						fill="var(--text-subtle)"
					/>
				</button>
			</div>

			<div className="flex items-center w-full justify-end gap-3 relative">
				{/* Create Button */}
				<Button
					variant="outline"
					className="p-2"
					icon={<AddIcon width={24} height={24} fill="currentColor" />}
				/>

				{/* More Icon */}
				<button
					onClick={toggleMoreMenu}
					className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-[7px] md:hidden"
				>
					<MoreIcon
						height={24}
						width={24}
						className="h-full w-full"
						fill="var(--text-subtle)"
					/>
				</button>

				{isMoreMenuOpen && (
					<div className="absolute top-12 right-0 bg-white shadow-md px-3 py-1">
						<MoreMenu className="flex md:hidden" />
					</div>
				)}

				<MoreMenu className="hidden md:flex" />
			</div>
		</div>
	);
}
