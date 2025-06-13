import Link from "next/link";
import ExpandIcon from "@/components/ui/icons/ExpandIcon";

interface SideNavNavItemProps {
	icon: React.ElementType;
	iconClassName?: string;
	label: string;
	href: string;
	expandable?: boolean;
	expanded?: boolean;
	isNested?: boolean;
	onClick?: () => void;
	active?: boolean;
}

const SideNavNavItem = ({
	icon: Icon,
	iconClassName = "h-6 w-6",
	label,
	href,
	expandable,
	expanded,
	isNested = false,
	onClick,
	active = false,
}: SideNavNavItemProps) => (
	<Link
		href={href}
		className={`flex h-8 w-full items-center px-3 hover:bg-gray-100 relative group ${
			active ? "bg-blue-50" : ""
		} ${isNested ? "pl-12" : ""}`}
		onClick={(e) => {
			if (onClick) {
				e.preventDefault();
				onClick();
			}
		}}
	>
		<Icon className={`text-gray-600 shrink-0 ${iconClassName}`} />
		<span className="ml-3 text-sm text-gray-700 hidden lg:block truncate">
			{label}
		</span>
		{expandable && (
			<ExpandIcon
				className={`ml-auto h-4 w-4 text-gray-500 transition-transform ${
					expanded ? "rotate-180" : ""
				}`}
			/>
		)}
		<span className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 whitespace-nowrap lg:hidden">
			{label}
		</span>
	</Link>
);

export default SideNavNavItem;
