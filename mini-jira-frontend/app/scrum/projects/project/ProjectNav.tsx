"use client";

import AddIcon from "@/components/ui/icons/AddIcon";
import WorldIcon from "@/components/ui/icons/WorldIcon";
import BacklogIcon from "@/components/ui/icons/BacklogIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";

function NavLink({
	href,
	icon: Icon,
	children,
	isActive = false,
}: {
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	isActive?: boolean;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center h-[41px] px-3 text-sm font-medium border-b-2 hover:bg-gray-50 transition-colors",
				isActive
					? "text-[#0052CC] border-[#0052CC]"
					: "text-gray-700 border-transparent hover:border-gray-300"
			)}
		>
			{Icon && (
				<Icon
					className={cn(
						"mr-2 h-4 w-4",
						isActive ? "text-[#0052CC]" : "text-gray-500"
					)}
				/>
			)}
			{children}
		</Link>
	);
}

export default function ProjectNav() {
	return (
		<nav className="w-full border-b border-gray-300 bg-white">
			<div className="flex items-center h-[41px] px-4">
				<ul className="flex items-center">
					<li>
						<NavLink href="#" icon={WorldIcon}>
							Summary
						</NavLink>
					</li>
					<li>
						<NavLink href="#" icon={BacklogIcon} isActive={true}>
							Backlog
						</NavLink>
					</li>
					<li>
						<NavLink href="#">More</NavLink>
					</li>
					<li>
						<button className="ml-2 p-1 h-6 w-6 text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
							<AddIcon className="h-full w-full" />
						</button>
					</li>
				</ul>
			</div>
		</nav>
	);
}
