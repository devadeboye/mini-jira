"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useModalStore } from "@/lib/stores/modalStore";
import { useWorkItem, useUpdateWorkItem } from "@/lib/hooks/use-work-items";
import { useProjectSprints } from "@/lib/hooks/use-sprints";
import {
	WorkItemType,
	WorkItemStatus,
	WorkItemPriority,
} from "@/lib/stores/workItemStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const WorkItemModal = () => {
	const params = useParams();
	const projectId = typeof params.id === "string" ? params.id : "";
	const { isWorkItemModalOpen, selectedWorkItemId, closeWorkItemModal } =
		useModalStore();
	const {
		data: workItem,
		isLoading,
		error,
	} = useWorkItem(selectedWorkItemId || "");
	const updateWorkItemMutation = useUpdateWorkItem();
	const { data: sprints } = useProjectSprints(projectId);

	// Refs for focus management
	const modalRef = useRef<HTMLDivElement>(null);
	const firstFocusableRef = useRef<HTMLInputElement>(null);
	const lastFocusableRef = useRef<HTMLButtonElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	// Form state
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		type: "task" as WorkItemType,
		status: "todo" as WorkItemStatus,
		priority: "medium" as WorkItemPriority,
		storyPoints: 0,
		sprintId: null as string | null,
	});

	// Update form data when work item loads
	useEffect(() => {
		if (workItem) {
			setFormData({
				title: workItem.title ?? "",
				description: workItem.description ?? "",
				type: workItem.type ?? "task",
				status: workItem.status ?? "todo",
				priority: workItem.priority ?? "medium",
				storyPoints: workItem.estimate ?? 0,
				sprintId: workItem.sprintId ?? null,
			});
		}
	}, [workItem]);

	// Focus management and modal setup
	useEffect(() => {
		if (isWorkItemModalOpen) {
			// Store the previously focused element
			previousActiveElement.current = document.activeElement as HTMLElement;

			// Prevent body scroll
			document.body.style.overflow = "hidden";

			// Focus the first focusable element after a short delay
			setTimeout(() => {
				firstFocusableRef.current?.focus();
			}, 100);

			// Announce modal opening to screen readers
			const announcement = `Work item details modal opened for ${
				workItem?.id || "work item"
			}`;
			announceToScreenReader(announcement);
		} else {
			// Restore body scroll
			document.body.style.overflow = "unset";

			// Return focus to previously focused element
			if (previousActiveElement.current) {
				previousActiveElement.current.focus();
			}
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isWorkItemModalOpen, workItem?.id]);

	// Handle escape key and focus trapping
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isWorkItemModalOpen) return;

			if (e.key === "Escape") {
				closeWorkItemModal();
				return;
			}

			// Focus trapping
			if (e.key === "Tab") {
				const focusableElements = modalRef.current?.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);

				if (!focusableElements || focusableElements.length === 0) return;

				const firstElement = focusableElements[0] as HTMLElement;
				const lastElement = focusableElements[
					focusableElements.length - 1
				] as HTMLElement;

				if (e.shiftKey) {
					// Shift + Tab
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					// Tab
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isWorkItemModalOpen, closeWorkItemModal]);

	const announceToScreenReader = (message: string) => {
		const ariaLiveRegion = document.createElement("div");
		ariaLiveRegion.setAttribute("aria-live", "polite");
		ariaLiveRegion.setAttribute("aria-atomic", "true");
		ariaLiveRegion.className = "sr-only";
		ariaLiveRegion.textContent = message;
		document.body.appendChild(ariaLiveRegion);
		setTimeout(() => document.body.removeChild(ariaLiveRegion), 1000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedWorkItemId) return;

		try {
			// Convert null to undefined for API compatibility
			const updateData = {
				...formData,
				sprintId: formData.sprintId || undefined,
			};

			await updateWorkItemMutation.mutateAsync({
				id: selectedWorkItemId,
				data: updateData,
			});

			announceToScreenReader("Work item updated successfully");
			closeWorkItemModal();
		} catch (error) {
			console.error("Failed to update work item:", error);
			announceToScreenReader("Failed to update work item. Please try again.");
		}
	};

	const handleInputChange = (field: string, value: string | number | null) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			closeWorkItemModal();
		}
	};

	if (!isWorkItemModalOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 overflow-y-auto"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-gradient-to-br from-slate-900/20 via-gray-900/30 to-slate-800/40 backdrop-blur-sm transition-all duration-300"
				onClick={handleBackdropClick}
				aria-hidden="true"
			/>

			{/* Modal */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div
					ref={modalRef}
					className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100"
				>
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						<h2
							id="modal-title"
							className="text-xl font-semibold text-gray-900"
						>
							{workItem?.id || "Work Item Details"}
						</h2>
						<button
							onClick={closeWorkItemModal}
							className="p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
							aria-label="Close modal"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
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
								<span className="sr-only">Loading work item details</span>
							</div>
						) : error ? (
							<div className="text-center py-8" role="alert">
								<p className="text-red-600">Failed to load work item details</p>
							</div>
						) : workItem ? (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div id="modal-description" className="sr-only">
									Edit work item details including title, description, type,
									status, priority, story points, and sprint assignment.
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
										onChange={(e) => handleInputChange("title", e.target.value)}
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
										onChange={(e) =>
											handleInputChange("description", e.target.value)
										}
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
												handleInputChange(
													"type",
													e.target.value as WorkItemType
												)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											aria-describedby="type-help"
										>
											<option value="story">Story</option>
											<option value="task">Task</option>
											<option value="bug">Bug</option>
										</select>
										<div id="type-help" className="sr-only">
											Select the type of work item: Story for user features,
											Task for development work, Bug for defects
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
												handleInputChange(
													"status",
													e.target.value as WorkItemStatus
												)
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
												handleInputChange(
													"priority",
													e.target.value as WorkItemPriority
												)
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
												handleInputChange(
													"storyPoints",
													parseInt(e.target.value) || 0
												)
											}
											min="0"
											max="100"
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											aria-describedby="story-points-help"
										/>
										<div id="story-points-help" className="sr-only">
											Enter the estimated effort for this work item in story
											points, from 0 to 100
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
											onChange={(e) =>
												handleInputChange("sprintId", e.target.value || null)
											}
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
										disabled={updateWorkItemMutation.isPending}
										className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										aria-describedby="save-help"
									>
										{updateWorkItemMutation.isPending
											? "Saving..."
											: "Save Changes"}
									</button>
									<div id="save-help" className="sr-only">
										Save all changes made to this work item
									</div>

									<button
										ref={lastFocusableRef}
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
