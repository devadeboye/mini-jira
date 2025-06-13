import Link from "next/link";
import JiraLogo from "@/components/ui/icons/JiraLogo";

interface AuthHeaderProps {
	rightText: string;
	rightLinkText: string;
	rightLinkHref: string;
}

export default function AuthHeader({
	rightText,
	rightLinkText,
	rightLinkHref,
}: AuthHeaderProps) {
	return (
		<header className="w-full px-4 py-6 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between max-w-7xl mx-auto">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
						<JiraLogo width={32} height={32} />
					</div>
					<span className="text-xl font-bold text-gray-900">Jira</span>
				</div>
				<div className="text-sm text-gray-600">
					{rightText}{" "}
					<Link
						href={rightLinkHref}
						className="text-blue-600 hover:text-blue-700"
					>
						{rightLinkText}
					</Link>
				</div>
			</div>
		</header>
	);
}
