import Link from "next/link";
import { IconType } from "@/types/icon";

interface SideNavNavItemProps {
	href: string;
	icon: IconType;
	className?: string;
	active?: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
}

export default function SideNavNavItem({
	href,
	icon: Icon,
	className = "",
	active = false,
	children,
	onClick,
}: SideNavNavItemProps) {
	const handleClick = (e: React.MouseEvent) => {
		if (onClick) {
			e.preventDefault();
			onClick();
		}
	};

	return (
		<Link
			href={href}
			onClick={handleClick}
			className={`flex h-8 w-full items-center px-3 hover:bg-gray-100 relative group ${
				active ? "bg-blue-50" : ""
			} ${className}`}
		>
			<Icon className="text-gray-600 shrink-0 h-5 w-5" />
			<span className="ml-3 text-sm text-gray-700 hidden lg:block truncate">
				{children}
			</span>
			<span className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 whitespace-nowrap lg:hidden z-50">
				{children}
			</span>
		</Link>
	);
}
