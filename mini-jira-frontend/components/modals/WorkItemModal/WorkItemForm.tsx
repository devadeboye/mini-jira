"use client";

import { useRef } from "react";
import { useProjectSprints } from "@/lib/hooks/use-sprints";
import {
	WorkItemType,
	WorkItemStatus,
	WorkItemPriority,
} from "@/lib/stores/workItemStore";

interface WorkItemFormProps {
	projectId: string;
	formData: {
		title: string;
		description: string;
		type: WorkItemType;
		status: WorkItemStatus;
		priority: WorkItemPriority;
		storyPoints: number;
		sprintId: string | null;
	};
	onInputChange: (field: string, value: string | number | null) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
	isLoading: boolean;
	firstFocusableRef: React.RefObject<HTMLInputElement | null>;
	lastFocusableRef: React.RefObject<HTMLButtonElement | null>;
}

const WorkItemForm = ({
	projectId,
	formData,
	onInputChange,
	onSubmit,
	onCancel,
	isLoading,
	firstFocusableRef,
	lastFocusableRef,
}: WorkItemFormProps) => {
	const { data: sprints } = useProjectSprints(projectId);

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<div id="modal-description" className="sr-only">
				Edit work item details including title, description, type, status,
				priority, story points, and sprint assignment.
			</div>

			{/* Title */}
			<div>
				<label
					htmlFor="title-input"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Title{" "}
					<span className="text-red-500" aria-label="required">
						*
					</span>
				</label>
				<input
					id="title-input"
					ref={firstFocusableRef}
					type="text"
					value={formData.title ?? ""}
					onChange={(e) => onInputChange("title", e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					required
					aria-describedby="title-help"
				/>
				<div id="title-help" className="sr-only">
					Enter a descriptive title for this work item
				</div>
			</div>

			{/* Description */}
			<div>
				<label
					htmlFor="description-input"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Description
				</label>
				<textarea
					id="description-input"
					value={formData.description ?? ""}
					onChange={(e) => onInputChange("description", e.target.value)}
					rows={4}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
					placeholder="Add a description..."
					aria-describedby="description-help"
				/>
				<div id="description-help" className="sr-only">
					Provide additional details about this work item
				</div>
			</div>

			{/* Type, Status, Priority - Grid layout for responsiveness */}
			<fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<legend className="sr-only">Work item classification</legend>

				{/* Type */}
				<div>
					<label
						htmlFor="type-select"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Type
					</label>
					<select
						id="type-select"
						value={formData.type}
						onChange={(e) =>
							onInputChange("type", e.target.value as WorkItemType)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						aria-describedby="type-help"
					>
						<option value="story">Story</option>
						<option value="task">Task</option>
						<option value="bug">Bug</option>
					</select>
					<div id="type-help" className="sr-only">
						Select the type of work item: Story for user features, Task for
						development work, Bug for defects
					</div>
				</div>

				{/* Status */}
				<div>
					<label
						htmlFor="status-select"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Status
					</label>
					<select
						id="status-select"
						value={formData.status}
						onChange={(e) =>
							onInputChange("status", e.target.value as WorkItemStatus)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						aria-describedby="status-help"
					>
						<option value="todo">To Do</option>
						<option value="in_progress">In Progress</option>
						<option value="in_review">In Review</option>
						<option value="done">Done</option>
					</select>
					<div id="status-help" className="sr-only">
						Select the current status of this work item
					</div>
				</div>

				{/* Priority */}
				<div>
					<label
						htmlFor="priority-select"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Priority
					</label>
					<select
						id="priority-select"
						value={formData.priority}
						onChange={(e) =>
							onInputChange("priority", e.target.value as WorkItemPriority)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						aria-describedby="priority-help"
					>
						<option value="urgent">Urgent</option>
						<option value="high">High</option>
						<option value="medium">Medium</option>
						<option value="low">Low</option>
					</select>
					<div id="priority-help" className="sr-only">
						Select the priority level for this work item
					</div>
				</div>
			</fieldset>

			{/* Story Points and Sprint - Grid layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Story Points */}
				<div>
					<label
						htmlFor="story-points-input"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Story Points
					</label>
					<input
						id="story-points-input"
						type="number"
						value={formData.storyPoints ?? 0}
						onChange={(e) =>
							onInputChange("storyPoints", parseInt(e.target.value) || 0)
						}
						min="0"
						max="100"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						aria-describedby="story-points-help"
					/>
					<div id="story-points-help" className="sr-only">
						Enter the estimated effort for this work item in story points, from
						0 to 100
					</div>
				</div>

				{/* Sprint */}
				<div>
					<label
						htmlFor="sprint-select"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Sprint
					</label>
					<select
						id="sprint-select"
						value={formData.sprintId ?? ""}
						onChange={(e) => onInputChange("sprintId", e.target.value || null)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						aria-describedby="sprint-help"
					>
						<option value="">Backlog</option>
						{sprints?.map((sprint) => (
							<option key={sprint.id} value={sprint.id}>
								{sprint.name} ({sprint.status})
							</option>
						))}
					</select>
					<div id="sprint-help" className="sr-only">
						Assign this work item to a sprint or leave in backlog
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3 pt-4">
				<button
					type="submit"
					disabled={isLoading}
					className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-describedby="save-help"
				>
					{isLoading ? "Saving..." : "Save Changes"}
				</button>
				<div id="save-help" className="sr-only">
					Save all changes made to this work item
				</div>

				<button
					ref={lastFocusableRef}
					type="button"
					onClick={onCancel}
					className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
				>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default WorkItemForm;
