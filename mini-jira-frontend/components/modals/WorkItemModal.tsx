"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useModalStore } from "@/lib/stores/modalStore";
import { useWorkItem, useUpdateWorkItem } from "@/lib/hooks/use-work-items";
import {
	WorkItemType,
	WorkItemStatus,
	WorkItemPriority,
} from "@/lib/stores/workItemStore";
import {
	WorkItemForm,
	ModalHeader,
	LoadingState,
	ErrorState,
	useModalFocus,
} from "./WorkItemModal/";

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

	// Focus management
	const {
		modalRef,
		firstFocusableRef,
		lastFocusableRef,
		announceToScreenReader,
	} = useModalFocus({
		isOpen: isWorkItemModalOpen,
		onClose: closeWorkItemModal,
		workItemId: workItem?.id,
	});

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
					<ModalHeader workItemId={workItem?.id} onClose={closeWorkItemModal} />

					{/* Content */}
					<div className="p-6">
						{isLoading ? (
							<LoadingState />
						) : error ? (
							<ErrorState />
						) : workItem ? (
							<WorkItemForm
								projectId={projectId}
								formData={formData}
								onInputChange={handleInputChange}
								onSubmit={handleSubmit}
								onCancel={closeWorkItemModal}
								isLoading={updateWorkItemMutation.isPending}
								firstFocusableRef={firstFocusableRef}
								lastFocusableRef={lastFocusableRef}
							/>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkItemModal;
