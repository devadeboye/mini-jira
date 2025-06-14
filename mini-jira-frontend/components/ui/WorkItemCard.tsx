import { useState, useRef, useEffect } from "react";
import { type WorkItem, useWorkItemStore } from "@/lib/stores/workItemStore";

interface WorkItemCardProps {
	workItem: WorkItem;
}

const WorkItemCard = ({ workItem }: WorkItemCardProps) => {
	const [isChecked, setIsChecked] = useState(false);
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const updateWorkItem = useWorkItemStore((state) => state.updateWorkItem);

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

		if (isStatusDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
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

	return (
		<div className="flex items-center gap-3 px-3 py-2 bg-[#E4EFFE] border border-gray-200 rounded-md hover:bg-[#d2e5ff] cursor-pointer">
			{/* Checkbox */}
			<input
				type="checkbox"
				checked={isChecked}
				onChange={(e) => setIsChecked(e.target.checked)}
				className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
					onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
					className={`px-3 py-1 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-1 ${
						currentStatus?.color || "bg-gray-100 text-gray-800"
					}`}
				>
					{currentStatus?.label || "TO DO"}
					<svg
						className={`w-4 h-4 transition-transform ${
							isStatusDropdownOpen ? "rotate-180" : ""
						}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
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
					<div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
						{statusOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => handleStatusChange(option.value)}
								className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
									option.value === workItem.status ? "bg-blue-50" : ""
								}`}
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
			<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
				<span className="text-white text-xs font-semibold">
					{getUserInitials(workItem.assignee)}
				</span>
			</div>
		</div>
	);
};

export default WorkItemCard;
