import Button from "@/components/ui/Button";
import JiraServiceManagementBanner from "@/components/ui/icons/JiraServiceManagementBanner";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function JiraManagementServiceCard({ className }: { className?: string }) {
	return (
		<div className={cn("bg-gray-100 h-full p-4", className)}>
			<div className="flex flex-col gap-4 shadow-sm rounded-xs bg-white">
				<Image
					src="/assets/svg/jsm-crossflow-light.ada078f1.svg"
					alt="Requests from Slack, Teams and email turning into a Jira Service Management request automatically"
					width={300}
					height={300}
				/>

				<div className="px-4 py-2 flex flex-col gap-2">
					<div className="w-full h-6">
						<JiraServiceManagementBanner />
					</div>
					<p className="font-semibold">Link your teams, make work visible</p>
					<p className="text-sm">
						Connect support teams with development teams to get the full
						picture, from request to resolution.
					</p>
				</div>

				<div className="flex flex-row gap-2 px-4 pb-4">
					<Button
						variant="outline"
						className="text-sm border-[1px] border-gray-300 py-0! px-2! h-8 font-semibold text-gray-500"
					>
						<span>Try it now</span>
					</Button>
					<Button variant="text" className="text-current text-sm">
						<span>Learn more</span>
					</Button>
				</div>
			</div>
		</div>
	);
}