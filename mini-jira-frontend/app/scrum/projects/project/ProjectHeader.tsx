"use client";

import MoreIcon from "@/components/ui/icons/MoreIcon";
import Image from "next/image";
import ExpandIcon from "@/components/ui/icons/ExpandIcon";
import ShareIcon from "@/components/ui/icons/ShareIcon";
import HotIcon from "@/components/ui/icons/HotIcon";
import { useParams } from "next/navigation";
import { useProject } from "@/lib/hooks/useProjects";

// Loading component for project name
function LoadingProjectName() {
	return <div className="h-7 w-32 bg-gray-200 animate-pulse rounded" />;
}

export default function ProjectHeader() {
	const params = useParams();
	const projectId = params.id as string;
	const { data: project, isLoading } = useProject(projectId);

	return (
		<header className="bg-white">
			<div className="px-4 py-3">
				<div className="text-sm text-gray-600 mb-1">Projects</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Image
							src="/assets/svg/10415.svg"
							alt="Project icon"
							height={20}
							width={20}
							className="rounded-sm"
						/>
						{isLoading ? (
							<LoadingProjectName />
						) : (
							<h1 className="text-lg font-semibold text-gray-900">
								{project?.name}
							</h1>
						)}
						<button className="h-8 w-8 p-[7px] hover:bg-gray-100 rounded-md transition-colors ml-1">
							<MoreIcon className="h-full w-full text-gray-500" />
						</button>
					</div>

					<div className="flex items-center gap-2">
						<button className="h-8 w-8 p-1.5 hover:bg-gray-100 rounded-md transition-colors border border-gray-300">
							<ExpandIcon className="h-full w-full text-gray-500" />
						</button>
						<button className="h-8 w-8 p-1.5 hover:bg-gray-100 rounded-md transition-colors border border-gray-300">
							<ShareIcon className="h-full w-full text-gray-500" />
						</button>
						<button className="h-8 w-8 p-1.5 hover:bg-gray-100 rounded-md transition-colors border border-gray-300">
							<HotIcon className="h-full w-full text-gray-500" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
