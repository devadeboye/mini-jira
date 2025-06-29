import Link from "next/link";

interface CardLinkProps {
	href: string;
  className?: string;
  label: string;
  value?: string;
}

export function ProjectCardLink({ href, label, value, className = '' }: CardLinkProps) {
	return (
		<Link
			href={href}
			className={`flex items-center justify-between no-underline hover:no-underline! hover:bg-gray-200 transition-colors ${className} p-1 rounded-xs`}
		>
			<p>{label}</p>
			{value && <p className="text-xs bg-gray-300 rounded-full px-2">{value}</p>}
		</Link>
	);
}
