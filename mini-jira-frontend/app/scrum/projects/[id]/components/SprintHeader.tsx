"use client";

import { Sprint } from "@/lib/api/sprints.api";
import {
	useStartSprint,
	useCompleteSprint,
	useDeleteSprint,
} from "@/lib/hooks/use-sprints";
import Button from "@/components/ui/Button";
import { ChevronDown, ChevronRight, Edit2, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SprintHeaderProps {
	sprint: Sprint;
}

export function SprintHeader({ sprint }: SprintHeaderProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { mutate: startSprint } = useStartSprint();
	const { mutate: completeSprint } = useCompleteSprint();
	const { mutate: deleteSprint } = useDeleteSprint(sprint.projectId);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}

		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isDropdownOpen]);

	const handleStartSprint = () => {
		startSprint(sprint.id);
	};

	const handleCompleteSprint = () => {
		completeSprint(sprint.id);
	};

	const handleDeleteSprint = () => {
		deleteSprint(sprint.id);
	};

	return (
		<div className="p-4 flex items-center justify-between bg-gray-50 border-b">
			<div className="flex items-center gap-2">
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="hover:bg-gray-200 rounded p-1"
				>
					{isExpanded ? (
						<ChevronDown className="w-4 h-4" />
					) : (
						<ChevronRight className="w-4 h-4" />
					)}
				</button>
				<div>
					<h3 className="font-medium">{sprint.name}</h3>
					{sprint.goal && (
						<p className="text-sm text-gray-600">{sprint.goal}</p>
					)}
				</div>
			</div>
			<div className="flex items-center gap-2">
				{sprint.status === "planned" && (
					<Button
						variant="primary"
						className="py-1 px-3 text-sm"
						onClick={handleStartSprint}
					>
						Start Sprint
					</Button>
				)}
				{sprint.status === "active" && (
					<Button
						variant="primary"
						className="py-1 px-3 text-sm"
						onClick={handleCompleteSprint}
					>
						Complete Sprint
					</Button>
				)}
				<div className="relative" ref={dropdownRef}>
					<Button
						variant="outline"
						className="p-1"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					>
						<MoreHorizontal className="w-4 h-4" />
					</Button>
					{isDropdownOpen && (
						<div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
							<button
								className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
								onClick={() => {
									/* TODO: Implement edit sprint */
								}}
							>
								<Edit2 className="w-4 h-4 mr-2" />
								Edit Sprint
							</button>
							<button
								className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
								onClick={handleDeleteSprint}
							>
								Delete Sprint
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
