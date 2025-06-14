"use client";

import { useEffect } from "react";
import { useBacklogItems } from "@/lib/hooks/use-work-items";
import { useWorkItemStore } from "@/lib/stores/workItemStore";
import { transformWorkItems } from "@/lib/utils/work-item-transform";
import WorkItemCard from "@/components/ui/WorkItemCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface BacklogContentProps {
	projectId: string;
}

const BacklogContent = ({ projectId }: BacklogContentProps) => {
	// React Query for server state management
	const {
		data: serverBacklogItems,
		isLoading,
		error,
		isError,
	} = useBacklogItems(projectId);

	// Zustand for local state management (only for syncing, not for rendering)
	const setWorkItems = useWorkItemStore((state) => state.setWorkItems);

	// Sync server data with local store when data changes
	useEffect(() => {
		if (serverBacklogItems) {
			const transformedItems = transformWorkItems(serverBacklogItems);
			setWorkItems(transformedItems);
		}
	}, [serverBacklogItems, setWorkItems]);

	// Use server data directly for rendering to avoid hydration issues
	const backlogItems = serverBacklogItems
		? transformWorkItems(serverBacklogItems)
		: [];

	// Loading state
	if (isLoading) {
		return (
			<div className="px-2 w-full h-full flex items-center justify-center bg-gray-50">
				<LoadingSpinner />
			</div>
		);
	}

	// Error state
	if (isError) {
		return (
			<div className="px-2 w-full h-full bg-gray-50">
				<div className="flex flex-row items-center justify-center text-center border-2 border-dashed border-red-300 rounded-lg w-full h-11 py-2 px-6">
					<div className="flex flex-col items-center justify-center gap-4 mx-auto">
						<p className="text-red-600 text-xs leading-relaxed">
							{error?.message || "Failed to load backlog items"}
						</p>
						<button
							onClick={() => window.location.reload()}
							className="text-red-600 hover:text-red-700 text-xs font-medium underline"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Empty state
	if (!backlogItems || backlogItems.length === 0) {
		return (
			<div className="px-2 w-full h-full bg-gray-50">
				<div className="flex flex-row items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-lg w-full h-11 py-2 px-6">
					<div className="flex flex-col items-center justify-center gap-4 mx-auto">
						<p className="text-gray-600 text-xs leading-relaxed">
							Your backlog is empty.
						</p>
						<button className="text-blue-600 hover:text-blue-700 text-xs font-medium underline">
							Create work item
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Render backlog items
	return (
		<div className="px-2 w-full h-full bg-gray-50">
			<div className="flex flex-col gap-0 py-4">
				{backlogItems.map((item) => (
					<WorkItemCard key={item.id} workItem={item} />
				))}
			</div>
		</div>
	);
};

export default BacklogContent;
