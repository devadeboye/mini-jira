import { useState, useRef, useEffect } from "react";
import { type WorkItem, useWorkItemStore } from "@/lib/stores/workItemStore";
import { useModalStore } from "@/lib/stores/modalStore";

interface WorkItemCardProps {
	workItem: WorkItem;
}

const WorkItemCard = ({ workItem }: WorkItemCardProps) => {
	const [isChecked, setIsChecked] = useState(false);
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const updateWorkItem = useWorkItemStore((state) => state.updateWorkItem);
	const openWorkItemModal = useModalStore((state) => state.openWorkItemModal);

	const statusOptions = [
		{ value: "todo", label: "TO DO", color: "bg-gray-100 text-gray-800" },
		{
			value: "in-progress",
			label: "IN PROGRESS",
			color: "bg-blue-100 text-blue-800",
		},
		{ value: "done", label: "DONE", color: "bg-green-100 text-green-800" },
	];

	const currentStatus = statusOptions.find(
		(option) => option.value === workItem.status
	);

	const handleStatusChange = (newStatus: string) => {
		updateWorkItem(workItem.id, { status: newStatus as any });
		setIsStatusDropdownOpen(false);
		// Announce status change to screen readers
		const announcement = `Work item ${workItem.id} status changed to ${
			statusOptions.find((s) => s.value === newStatus)?.label
		}`;
		const ariaLiveRegion = document.createElement("div");
		ariaLiveRegion.setAttribute("aria-live", "polite");
		ariaLiveRegion.setAttribute("aria-atomic", "true");
		ariaLiveRegion.className = "sr-only";
		ariaLiveRegion.textContent = announcement;
		document.body.appendChild(ariaLiveRegion);
		setTimeout(() => document.body.removeChild(ariaLiveRegion), 1000);
	};

	const handleCardClick = (e: React.MouseEvent) => {
		// Don't open modal if clicking on interactive elements
		const target = e.target as HTMLElement;
		if (target.closest("input, button, select")) {
			return;
		}
		openWorkItemModal(workItem.id);
	};

	const handleCardKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openWorkItemModal(workItem.id);
		}
	};

	const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setIsStatusDropdownOpen(false);
		} else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			// Focus management for dropdown options
			const buttons = dropdownRef.current?.querySelectorAll(
				"button[data-status-option]"
			);
			if (buttons) {
				const currentIndex = Array.from(buttons).findIndex(
					(btn) => btn === document.activeElement
				);
				const nextIndex =
					e.key === "ArrowDown"
						? (currentIndex + 1) % buttons.length
						: currentIndex <= 0
						? buttons.length - 1
						: currentIndex - 1;
				(buttons[nextIndex] as HTMLElement).focus();
			}
		}
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsStatusDropdownOpen(false);
			}
		};

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isStatusDropdownOpen) {
				setIsStatusDropdownOpen(false);
			}
		};

		if (isStatusDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscapeKey);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [isStatusDropdownOpen]);

	const getUserInitials = (assignee: string | null) => {
		if (!assignee) return "U";
		return assignee
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const priorityColors = {
		urgent: "border-l-red-500",
		high: "border-l-orange-500",
		medium: "border-l-yellow-500",
		low: "border-l-green-500",
	};

	return (
		<div
			ref={cardRef}
			className={`flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 border-l-4 ${
				priorityColors[workItem.priority] || "border-l-gray-300"
			} rounded-md hover:bg-[#E4EFFE] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors`}
			onClick={handleCardClick}
			onKeyDown={handleCardKeyDown}
			tabIndex={0}
			role="button"
			aria-label={`Work item ${workItem.id}: ${workItem.title}. Priority: ${workItem.priority}. Status: ${currentStatus?.label}. Click to edit.`}
		>
			{/* Checkbox */}
			<input
				type="checkbox"
				checked={isChecked}
				onChange={(e) => setIsChecked(e.target.checked)}
				className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
				aria-label={`Select work item ${workItem.id}`}
				onClick={(e) => e.stopPropagation()}
			/>

			{/* Work Item ID */}
			<span className="text-sm font-medium text-blue-600 min-w-fit">
				{workItem.id}
			</span>

			{/* Work Item Title */}
			<span className="flex-1 text-sm text-gray-900 truncate">
				{workItem.title}
			</span>

			{/* Status Dropdown */}
			<div className="relative" ref={dropdownRef}>
				<button
					onClick={(e) => {
						e.stopPropagation();
						setIsStatusDropdownOpen(!isStatusDropdownOpen);
					}}
					onKeyDown={handleDropdownKeyDown}
					className={`px-3 py-1 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1 transition-colors ${
						currentStatus?.color || "bg-gray-100 text-gray-800"
					}`}
					aria-label={`Change status from ${currentStatus?.label}. Current status: ${currentStatus?.label}`}
					aria-expanded={isStatusDropdownOpen}
					aria-haspopup="listbox"
				>
					{currentStatus?.label || "TO DO"}
					<svg
						className={`w-4 h-4 transition-transform ${
							isStatusDropdownOpen ? "rotate-180" : ""
						}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{/* Dropdown Menu */}
				{isStatusDropdownOpen && (
					<div
						className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
						role="listbox"
						aria-label="Status options"
					>
						{statusOptions.map((option, index) => (
							<button
								key={option.value}
								data-status-option
								onClick={(e) => {
									e.stopPropagation();
									handleStatusChange(option.value);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										e.stopPropagation();
										handleStatusChange(option.value);
									}
								}}
								className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-md last:rounded-b-md transition-colors ${
									option.value === workItem.status ? "bg-blue-50" : ""
								}`}
								role="option"
								aria-selected={option.value === workItem.status}
								tabIndex={index === 0 ? 0 : -1}
							>
								<span className={`px-2 py-1 rounded-md ${option.color}`}>
									{option.label}
								</span>
							</button>
						))}
					</div>
				)}
			</div>

			{/* User Avatar */}
			<div
				className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
				aria-label={`Assigned to ${workItem.assignee || "Unassigned"}`}
				title={`Assigned to ${workItem.assignee || "Unassigned"}`}
			>
				<span className="text-white text-xs font-semibold">
					{getUserInitials(workItem.assignee)}
				</span>
			</div>
		</div>
	);
};

export default WorkItemCard;
