"use client";

import { useProjects } from "@/lib/hooks/useProjects";
import { useNavigationStore } from "@/lib/stores";
import SideNavNavItem from "./SideNavNavItem";
import ProjectsIcon from "@/components/ui/icons/ProjectsIcon";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import ViewAllProjects from "@/components/ui/icons/ViewAllProjects";
import ExpandIcon from "@/components/ui/icons/ExpandIcon";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function SideNavProjectsDropdown() {
	const pathname = usePathname();
	const { data: projects = [], isLoading, error } = useProjects();
	const { isProjectsDropdownOpen, toggleProjectsDropdown } =
		useNavigationStore();

	return (
		<div className="space-y-0.5">
			<div
				className="flex h-8 w-full items-center px-3 hover:bg-gray-100 relative group cursor-pointer"
				onClick={toggleProjectsDropdown}
			>
				<ProjectsIcon className="text-gray-600 shrink-0 h-5 w-5" />
				<span className="ml-3 text-sm text-gray-700 hidden lg:block truncate">
					Projects ({isLoading ? "..." : projects.length})
				</span>
				<ExpandIcon
					className={`ml-auto h-4 w-4 text-gray-500 transition-transform ${
						isProjectsDropdownOpen ? "rotate-180" : ""
					}`}
				/>
				<span className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 whitespace-nowrap lg:hidden z-50">
					Projects ({isLoading ? "..." : projects.length})
				</span>
			</div>

			{isProjectsDropdownOpen && (
				<div className="space-y-0.5">
					<SideNavNavItem
						href="/projects/all"
						icon={ViewAllProjects}
						className="pl-12"
						active={pathname === "/projects/all"}
					>
						View all projects
					</SideNavNavItem>

					{isLoading && (
						<div className="pl-12 py-1 text-xs text-gray-500 hidden lg:block">
							Loading projects...
						</div>
					)}

					{error && (
						<div className="pl-12 py-1 text-xs text-red-500 hidden lg:block">
							Failed to load projects
						</div>
					)}

					{!isLoading && !error && projects.length > 0 && (
						<>
							{projects.map((project) => (
								<SideNavNavItem
									key={project.id}
									href={`/scrum/projects/${project.id}`}
									icon={
										<Image
											src="/assets/svg/10415.svg"
											alt="Project icon"
											height={20}
											width={20}
											className="rounded-sm"
										/>
									}
									className="pl-12"
									active={pathname === `/scrum/projects/${project.id}`}
								>
									{project.name} ({project.key})
								</SideNavNavItem>
							))}
						</>
					)}

					{!isLoading && !error && projects.length === 0 && (
						<div className="pl-12 py-1 text-xs text-gray-500 hidden lg:block">
							No projects found
						</div>
					)}
				</div>
			)}
		</div>
	);
}
