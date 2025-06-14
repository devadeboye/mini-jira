import DropdownIcon from "@/components/ui/icons/DropdownIcon";
import { useParams } from "next/navigation";
import { useCreateSprint, useProjectSprints } from "@/lib/hooks/use-sprints";
import { CreateSprintPayload, SPRINT_DEFAULTS } from "@/lib/types/sprint.types";
import { useState } from "react";

interface BacklogHeaderProps {
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	workItemsCount: number;
}

const BacklogHeader = ({
	isCollapsed,
	onToggleCollapse,
	workItemsCount,
}: BacklogHeaderProps) => {
	const params = useParams();
	const projectId = typeof params.id === "string" ? params.id : "";
	const { data: sprints } = useProjectSprints(projectId);
	const createSprintMutation = useCreateSprint(projectId);
	const [isCreating, setIsCreating] = useState(false);

	// Generate next sprint name
	const getNextSprintName = () => {
		if (!sprints) return "Sprint 1";
		const sprintNumbers = sprints
			.map((sprint) => {
				const match = sprint.name.match(/Sprint (\d+)/);
				return match ? parseInt(match[1]) : 0;
			})
			.filter((num) => num > 0);

		const maxNumber = sprintNumbers.length > 0 ? Math.max(...sprintNumbers) : 0;
		return `Sprint ${maxNumber + 1}`;
	};

	const handleCreateSprint = async () => {
		if (!projectId || isCreating) return;

		setIsCreating(true);
		try {
			const payload: CreateSprintPayload = {
				name: getNextSprintName(),
				goal: SPRINT_DEFAULTS.GOAL,
			};
			await createSprintMutation.mutateAsync(payload);
		} catch (error) {
			console.error("Failed to create sprint:", error);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="flex items-center justify-between p-4 bg-gray-100 rounded-t-lg">
			<div className="flex items-center gap-3">
				<button
					onClick={onToggleCollapse}
					className="p-1 hover:bg-gray-200 rounded"
				>
					<DropdownIcon
						className={`h-4 w-4 text-gray-600 transition-transform ${
							isCollapsed ? "-rotate-90" : ""
						}`}
					/>
				</button>

				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold text-gray-900">Backlog</h2>
				</div>

				<span className="text-sm text-gray-600">
					({workItemsCount} work items)
				</span>
			</div>

			<div className="flex items-center gap-4">
				{/* Status Indicators */}
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center w-6 h-4 bg-gray-200 rounded text-xs font-medium text-gray-600">
						0
					</div>
					<div className="flex items-center justify-center w-6 h-4 bg-[#8fb8f6] rounded text-xs font-medium text-black">
						0
					</div>
					<div className="flex items-center justify-center w-6 h-4 bg-[#dcfff1] rounded text-xs font-medium text-black">
						0
					</div>
				</div>

				<button
					onClick={handleCreateSprint}
					disabled={isCreating || createSprintMutation.isPending}
					className="px-4 py-1 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isCreating || createSprintMutation.isPending
						? "Creating..."
						: "Create sprint"}
				</button>

				<button className="p-2 hover:bg-gray-200 rounded">
					<svg
						className="h-4 w-4 text-gray-600"
						viewBox="0 0 16 16"
						fill="currentColor"
					>
						<path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default BacklogHeader;
