"use client";

import { useParams } from "next/navigation";
import { useProjectSprints } from "@/lib/hooks/use-sprints";
import { useSprintWorkItems } from "@/lib/hooks/use-work-items";
import { Sprint } from "@/lib/api/sprints.api";
import SprintHeader from "./SprintHeader";
import SprintContent from "./SprintContent";
import SprintFooter from "./SprintFooter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState } from "react";

const SprintsContainer = () => {
	const params = useParams();
	const projectId = typeof params.id === "string" ? params.id : "";
	const { data: sprints, isLoading } = useProjectSprints(projectId);
	const [expandedSprintIds, setExpandedSprintIds] = useState<string[]>([]);

	const toggleSprintExpanded = (sprintId: string) => {
		setExpandedSprintIds((prev) =>
			prev.includes(sprintId)
				? prev.filter((id) => id !== sprintId)
				: [...prev, sprintId]
		);
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!sprints || sprints.length === 0) {
		return null;
	}

	// Sort sprints: active first, then planned, then completed
	const sortedSprints = [...sprints].sort((a, b) => {
		const statusOrder = { active: 0, planned: 1, completed: 2 };
		return statusOrder[a.status] - statusOrder[b.status];
	});

	return (
		<div className="space-y-4">
			{sortedSprints.map((sprint) => {
				const isExpanded = expandedSprintIds.includes(sprint.id);

				return (
					<SprintPanelItem
						key={sprint.id}
						sprint={sprint}
						isExpanded={isExpanded}
						onToggleExpanded={() => toggleSprintExpanded(sprint.id)}
					/>
				);
			})}
		</div>
	);
};

interface SprintPanelItemProps {
	sprint: Sprint;
	isExpanded: boolean;
	onToggleExpanded: () => void;
}

const SprintPanelItem = ({
	sprint,
	isExpanded,
	onToggleExpanded,
}: SprintPanelItemProps) => {
	const { data: sprintItems, isLoading } = useSprintWorkItems(sprint.id);

	return (
		<div className="border border-gray-200 rounded-lg bg-gray-50">
			<SprintHeader
				isCollapsed={!isExpanded}
				onToggleCollapse={onToggleExpanded}
				sprintName={sprint.name}
				workItemsCount={sprintItems?.length || 0}
			/>

			{isExpanded && (
				<>
					{isLoading ? (
						<div className="p-4 flex justify-center">
							<LoadingSpinner />
						</div>
					) : (
						<>
							<SprintContent sprint={sprint} />
							<SprintFooter sprint={sprint} />
						</>
					)}
				</>
			)}
		</div>
	);
};

export default SprintsContainer;
