"use client";

import { Sprint } from "@/lib/api/sprints.api";
import { useCreateWorkItem } from "@/lib/hooks/use-work-items";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface SprintFooterProps {
	sprint: Sprint;
}

export function SprintFooter({ sprint }: SprintFooterProps) {
	const { mutate: createWorkItem } = useCreateWorkItem(sprint.projectId);

	return (
		<div className="p-4 bg-gray-50 border-t">
			<Button
				variant="outline"
				className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-1 px-3 text-sm"
				onClick={() => {
					// TODO: Implement create work item modal
				}}
			>
				<Plus className="w-4 h-4 mr-2" />
				Create Issue
			</Button>
		</div>
	);
}
