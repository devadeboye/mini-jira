"use client";

import { useParams } from "next/navigation";
import { useProjectSprints, useActiveSprint } from "@/lib/hooks/use-sprints";
import { useSprintWorkItems } from "@/lib/hooks/use-work-items";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SprintHeader } from "./SprintHeader";
import { SprintContent } from "./SprintContent";
import { SprintFooter } from "./SprintFooter";

export function SprintPanel() {
	const { id: projectId } = useParams();
	const { data: sprints, isLoading: isLoadingSprints } = useProjectSprints(
		projectId as string
	);
	const activeSprint = useActiveSprint(projectId as string);
	const { data: sprintItems, isLoading: isLoadingWorkItems } =
		useSprintWorkItems(activeSprint?.id ?? "");

	if (isLoadingSprints || isLoadingWorkItems) {
		return <LoadingSpinner />;
	}

	const plannedSprints =
		sprints?.filter((sprint) => sprint.status === "planned") ?? [];

	return (
		<div className="space-y-4">
			{/* Active Sprint */}
			{activeSprint && (
				<div className="border rounded-lg shadow-sm">
					<SprintHeader sprint={activeSprint} />
					<SprintContent items={sprintItems ?? []} />
					<SprintFooter sprint={activeSprint} />
				</div>
			)}

			{/* Planned Sprints */}
			{plannedSprints.map((sprint) => (
				<div key={sprint.id} className="border rounded-lg shadow-sm">
					<SprintHeader sprint={sprint} />
					<SprintContent items={[]} />
					<SprintFooter sprint={sprint} />
				</div>
			))}

			{/* Create Sprint Button */}
			<Button
				variant="outline"
				className="w-full flex items-center justify-center gap-2"
				onClick={() => {
					// TODO: Implement create sprint modal
				}}
			>
				<Plus className="w-4 h-4" />
				Create Sprint
			</Button>
		</div>
	);
}
