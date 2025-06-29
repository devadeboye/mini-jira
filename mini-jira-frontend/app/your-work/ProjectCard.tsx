import { Project } from "@/lib/api/projects.api";
import Link from "next/link";
import { ProjectCardLink } from "./ProjectCardLink";
import DropdownIcon from "@/components/ui/icons/DropdownIcon";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function ProjectCard({ project }: { project: Project }) {
	return (
		<div className="rounded-xs shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md w-56 bg-[#BBE9F9] h-fit text-[11px] md:w-full">
			<div className="h-full box-border bg-white rounded-xs ml-[8%] pt-4">
				<div className="w-full pl-3 pr-3 pb-2 flex flex-col gap-2">
					<div className="pl-1 relative">
						<Image
							src="/assets/svg/10415.svg"
							alt="Project icon"
							height={20}
							width={20}
							className="rounded-sm z-10 absolute -left-[22px]"
						/>

						<h1 className="text-sm font-semibold capitalize">{project.name}</h1>
						<p className="">Team-managed software</p>
					</div>

					{/* Quick links */}
					<div className="flex flex-col gap-2">
						<h2 className="font-semibold text-gray-500 pl-1">Quick links</h2>

						<div>
							<ProjectCardLink
								href={`/scrum/projects/${project.id}`}
								label="My open work items"
								value="10"
							/>

							<ProjectCardLink href="#" label="Done work items" />
						</div>
					</div>
				</div>

				<div className="border-t border-gray-300 flex items-center justify-between h-7 pl-4 pr-3">
					<Button
						key={project.id}
						className="flex items-center gap-1 group py-0! px-0.5! rounded-xs hover:bg-gray-100"
						variant="text"
						onClick={(e) => {
							e.currentTarget.blur();
						}}
					>
						<p>1 board</p>
						<DropdownIcon
							className={`h-3 w-3 text-gray-600 transition-transform`}
						/>
					</Button>
				</div>
			</div>
		</div>
	);
}
