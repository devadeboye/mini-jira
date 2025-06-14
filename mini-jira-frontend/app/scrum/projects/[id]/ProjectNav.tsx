import Link from "next/link";
import WorldIcon from "@/components/ui/icons/WorldIcon";
import BacklogIcon from "@/components/ui/icons/BacklogIcon";

function NavLink({
	href,
	icon: Icon,
	children,
}: {
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className="flex items-center h-[41px] px-3 text-sm font-medium border-b-2 hover:bg-gray-50 transition-colors text-gray-700 border-transparent hover:border-gray-300"
		>
			{Icon && <Icon className="mr-2 h-4 w-4 text-gray-500" />}
			{children}
		</Link>
	);
}

export function ProjectNav() {
	return (
		<nav className="border-b border-gray-300">
			<div className="container mx-auto">
				<ul className="flex items-center">
					<li>
						<NavLink href="#" icon={WorldIcon}>
							Summary
						</NavLink>
					</li>
					<li>
						<NavLink href="#" icon={BacklogIcon}>
							Backlog
						</NavLink>
					</li>
					<li>
						<NavLink href="#">Board</NavLink>
					</li>
					<li>
						<NavLink href="#">Settings</NavLink>
					</li>
				</ul>
			</div>
		</nav>
	);
}
