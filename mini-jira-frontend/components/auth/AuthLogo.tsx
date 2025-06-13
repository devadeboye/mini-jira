import JiraLogo from "@/components/ui/icons/JiraLogo";

interface AuthLogoProps {
	title: string;
	subtitle: string;
}

export default function AuthLogo({ title, subtitle }: AuthLogoProps) {
	return (
		<div className="text-center">
			<div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg">
				<JiraLogo width={64} height={64} />
			</div>
			<h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
			<p className="text-gray-600">{subtitle}</p>
		</div>
	);
}
