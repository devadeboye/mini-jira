"use client";

import MoreIcon from "@/components/ui/icons/MoreIcon";
import Image from "next/image";
import ExpandIcon from "@/components/ui/icons/ExpandIcon";
import ShareIcon from "@/components/ui/icons/ShareIcon";
import HotIcon from "@/components/ui/icons/HotIcon";
import { useParams } from "next/navigation";

export default function ProjectHeader() {
	const params = useParams();
	const projectId = params.id;

	return (
		<div className="flex flex-col gap-1 px-4 py-3 box-border">
			<div className="text-sm">Projects</div>
			<div className="flex flex-row gap-1 items-center justify-between">
				<div className="flex flex-row gap-2 items-center">
					<Image
						src="/assets/svg/10415.svg"
						alt="project1"
						height={24}
						width={24}
						className="h-4 w-4 lg:h-5 lg:w-5 rounded-sm"
					/>
					<div className="text-lg font-semibold">Project {projectId}</div>

					{/* More Icon */}
					<button className="h-8 w-8 p-[7px]">
						<MoreIcon
							height={24}
							width={24}
							className="h-full w-full"
							fill="var(--text-subtle)"
						/>
					</button>
				</div>

				<div className="flex flex-row gap-2 items-center">
					{/* Expand Icon */}
					<button className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-1">
						<ExpandIcon
							height={24}
							width={24}
							className="h-full w-full"
							fill="var(--text-subtle)"
						/>
					</button>

					{/* Share Icon */}
					<button className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-1">
						<ShareIcon
							height={24}
							width={24}
							className="h-full w-full"
							fill="var(--text-subtle)"
						/>
					</button>

					{/* Hot Icon */}
					<button className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-1">
						<HotIcon
							height={24}
							width={24}
							className="h-full w-full"
							fill="var(--text-subtle)"
						/>
					</button>
				</div>
			</div>
		</div>
	);
}
