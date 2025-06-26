import { Project } from "@/lib/api/projects.api";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
		<Link
			key={project.id}
			href={`/scrum/projects/${project.id}`}
			className="block group"
		>
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-3">
						{project.avatar ? (
							<img
								src={project.avatar}
								alt={project.name}
								className="w-10 h-10 rounded"
							/>
						) : (
							<div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-semibold text-lg">
								{project.name[0].toUpperCase()}
							</div>
						)}
						<div>
							<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
								{project.name}
							</h3>
							<p className="text-sm text-gray-500">{project.key}</p>
						</div>
					</div>
				</div>
				{project.description && (
					<p className="text-gray-600 text-sm line-clamp-2">
						{project.description}
					</p>
				)}
			</div>
		</Link>
	);
}