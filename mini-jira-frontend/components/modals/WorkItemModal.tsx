"use client";

import { useState, useEffect } from "react";
import { useModalStore } from "@/lib/stores/modalStore";
import { useWorkItem, useUpdateWorkItem } from "@/lib/hooks/use-work-items";
import {
	WorkItemType,
	WorkItemStatus,
	WorkItemPriority,
} from "@/lib/stores/workItemStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const WorkItemModal = () => {
	const { isWorkItemModalOpen, selectedWorkItemId, closeWorkItemModal } =
		useModalStore();
	const {
		data: workItem,
		isLoading,
		error,
	} = useWorkItem(selectedWorkItemId || "");
	const updateWorkItemMutation = useUpdateWorkItem();

	// Form state
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		type: "task" as WorkItemType,
		status: "todo" as WorkItemStatus,
		priority: "medium" as WorkItemPriority,
		storyPoints: 0,
	});

	// Update form data when work item loads
	useEffect(() => {
		if (workItem) {
			setFormData({
				title: workItem.title,
				description: workItem.description || "",
				type: workItem.type,
				status: workItem.status,
				priority: workItem.priority,
				storyPoints: workItem.estimate,
			});
		}
	}, [workItem]);

	// Close modal on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeWorkItemModal();
			}
		};

		if (isWorkItemModalOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isWorkItemModalOpen, closeWorkItemModal]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedWorkItemId) return;

		try {
			await updateWorkItemMutation.mutateAsync({
				id: selectedWorkItemId,
				data: formData,
			});
			closeWorkItemModal();
		} catch (error) {
			console.error("Failed to update work item:", error);
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	if (!isWorkItemModalOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
				onClick={closeWorkItemModal}
			/>

			{/* Modal */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">
							{workItem?.id || "Work Item Details"}
						</h2>
						<button
							onClick={closeWorkItemModal}
							className="p-2 hover:bg-gray-100 rounded-md transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Content */}
					<div className="p-6">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<LoadingSpinner />
							</div>
						) : error ? (
							<div className="text-center py-8">
								<p className="text-red-600">Failed to load work item details</p>
							</div>
						) : workItem ? (
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Title */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Title
									</label>
									<input
										type="text"
										value={formData.title}
										onChange={(e) => handleInputChange("title", e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										required
									/>
								</div>

								{/* Description */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											handleInputChange("description", e.target.value)
										}
										rows={4}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
										placeholder="Add a description..."
									/>
								</div>

								{/* Type, Status, Priority - Grid layout for responsiveness */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{/* Type */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Type
										</label>
										<select
											value={formData.type}
											onChange={(e) =>
												handleInputChange(
													"type",
													e.target.value as WorkItemType
												)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="story">Story</option>
											<option value="task">Task</option>
											<option value="bug">Bug</option>
										</select>
									</div>

									{/* Status */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Status
										</label>
										<select
											value={formData.status}
											onChange={(e) =>
												handleInputChange(
													"status",
													e.target.value as WorkItemStatus
												)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="todo">To Do</option>
											<option value="in_progress">In Progress</option>
											<option value="in_review">In Review</option>
											<option value="done">Done</option>
										</select>
									</div>

									{/* Priority */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Priority
										</label>
										<select
											value={formData.priority}
											onChange={(e) =>
												handleInputChange(
													"priority",
													e.target.value as WorkItemPriority
												)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="urgent">Urgent</option>
											<option value="high">High</option>
											<option value="medium">Medium</option>
											<option value="low">Low</option>
										</select>
									</div>
								</div>

								{/* Story Points */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Story Points
									</label>
									<input
										type="number"
										value={formData.storyPoints}
										onChange={(e) =>
											handleInputChange(
												"storyPoints",
												parseInt(e.target.value) || 0
											)
										}
										min="0"
										max="100"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								{/* Actions */}
								<div className="flex flex-col sm:flex-row gap-3 pt-4">
									<button
										type="submit"
										disabled={updateWorkItemMutation.isPending}
										className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										{updateWorkItemMutation.isPending
											? "Saving..."
											: "Save Changes"}
									</button>
									<button
										type="button"
										onClick={closeWorkItemModal}
										className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
									>
										Cancel
									</button>
								</div>
							</form>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkItemModal;
