"use client";

import { useState, useRef, useEffect } from "react";
import AddIcon from "@/components/ui/icons/AddIcon";
import { useParams } from "next/navigation";
import { useCreateWorkItem } from "@/lib/hooks/use-work-items";
import {
	WorkItemType,
	useWorkItemStore,
	WorkItem,
} from "@/lib/stores/workItemStore";
import { WorkItem as APIWorkItem } from "@/lib/api/work-items.api";

const BacklogFooter = () => {
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const params = useParams();
	const projectId = typeof params.id === "string" ? params.id : "";
	const addWorkItem = useWorkItemStore((state) => state.addWorkItem);

	// Transform API WorkItem to store WorkItem
	const transformWorkItem = (apiWorkItem: APIWorkItem): WorkItem => ({
		...apiWorkItem,
		assignee: apiWorkItem.assignee || null,
		description: apiWorkItem.description || "",
		sprintId: apiWorkItem.sprintId || null,
	});

	// Use React Query mutation with onSuccess callback
	const createWorkItemMutation = useCreateWorkItem({
		onSuccess: (newWorkItem: APIWorkItem) => {
			// Transform and update local state with the new work item
			addWorkItem(transformWorkItem(newWorkItem));
		},
	});

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const handleSubmit = async (title: string) => {
		if (!title.trim() || !projectId) return;

		try {
			await createWorkItemMutation.mutateAsync({
				title,
				type: "task" as WorkItemType,
				priority: "medium",
				description: "",
				projectId,
			});

			// Clear input
			if (inputRef.current) {
				inputRef.current.value = "";
			}
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to create work item:", error);
		}
	};

	const handleBlur = () => {
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const value = e.currentTarget.value;
			if (value.trim()) {
				handleSubmit(value);
			} else {
				setIsEditing(false);
			}
		} else if (e.key === "Escape") {
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="px-3 p-3 bg-gray-50 rounded-b-lg">
				<input
					ref={inputRef}
					type="text"
					placeholder="Describe what needs to be done, paste a Confluence link, or search confluence"
					className="w-full px-3 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10"
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					disabled={createWorkItemMutation.isPending}
				/>
			</div>
		);
	}

	return (
		<div className="px-8 p-3 bg-gray-50 rounded-b-lg">
			<button
				onClick={() => setIsEditing(true)}
				className="flex items-center gap-2 text-text-subtle hover:text-blue-700 font-medium text-sm"
				disabled={createWorkItemMutation.isPending}
			>
				<AddIcon className="h-4 w-4" />
				Create
			</button>
		</div>
	);
};

export default BacklogFooter;
