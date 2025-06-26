import { Project } from "@/lib/api/projects.api";
import Link from "next/link";
import { ProjectCardLink } from "./ProjectCardLink";

export default function ProjectCard({ project }: { project: Project }) {
	return (
		<div className="rounded-xs shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md w-56 bg-[#BBE9F9] h-fit text-[11px]">
			<div className="h-full box-border bg-white rounded-xs ml-[8%] pt-4">
				<div className="w-full pl-3 pr-3 pb-2 flex flex-col gap-2">
					<div className="pl-1">
						<h1 className="text-sm font-semibold capitalize">{project.name}</h1>
						<p className="">Team-managed software</p>
					</div>

					{/* Quick links */}
					<div className="flex flex-col gap-2">
						<h2 className="font-semibold text-gray-500 pl-1">Quick links</h2>

						<div>
							<ProjectCardLink href="#" label="My open work items" value="10" />

							<ProjectCardLink href="#" label="Done work items" />
						</div>
					</div>
				</div>

				<div className="border-t border-gray-300 flex items-center justify-between h-7 pl-4 pr-3">
					<Link
						key={project.id}
						href={`/scrum/projects/${project.id}`}
						className="block group"
					>
						<p>1 board</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
