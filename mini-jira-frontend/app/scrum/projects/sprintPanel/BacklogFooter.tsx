"use client";

import { useState, useRef, useEffect } from "react";
import AddIcon from "@/components/ui/icons/AddIcon";
import { useParams } from "next/navigation";
import { useWorkItemsStore } from "@/lib/stores/work-items.store";

const BacklogFooter = () => {
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { id: projectId } = useParams();
	const createWorkItem = useWorkItemsStore((state) => state.createWorkItem);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const handleSubmit = async (title: string) => {
		if (!title.trim() || !projectId) return;

		try {
			await createWorkItem(projectId as string, {
				title,
				type: "task",
				priority: "medium",
				description: "",
				estimate: 0,
			});
		} catch (error) {
			console.error("Failed to create work item:", error);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setIsEditing(false);
		if (value.trim()) {
			handleSubmit(value);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const value = e.currentTarget.value;
			setIsEditing(false);
			if (value.trim()) {
				handleSubmit(value);
			}
		} else if (e.key === "Escape") {
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="px-3 p-3">
				<input
					ref={inputRef}
					type="text"
					placeholder="Describe what needs to be done, paste a Confluence link, or search confluence"
					className="w-full px-3 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10"
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
			</div>
		);
	}

	return (
		<div className="px-8 p-3">
			<button
				onClick={() => setIsEditing(true)}
				className="flex items-center gap-2 text-text-subtle hover:text-blue-700 font-medium text-sm"
			>
				<AddIcon className="h-4 w-4" />
				Create
			</button>
		</div>
	);
};

export default BacklogFooter;
