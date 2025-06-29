import UserIcon from "@/components/ui/icons/UserIcon";
import Link from "next/link";

export default function AccountDropdownMenuItem({ href, children, onClick, icon }: { href: string, children: React.ReactNode, onClick: () => void, icon: React.ReactNode }) {
	return (
		<Link
			href={href}
			className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 gap-4 no-underline!"
			onClick={onClick}
		>
			{icon}
			{children}
		</Link>
	);
}