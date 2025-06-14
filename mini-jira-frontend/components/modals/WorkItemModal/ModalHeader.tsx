interface ModalHeaderProps {
	workItemId?: string;
	onClose: () => void;
}

const ModalHeader = ({ workItemId, onClose }: ModalHeaderProps) => {
	return (
		<div className="flex items-center justify-between p-6 border-b border-gray-200">
			<h2 id="modal-title" className="text-xl font-semibold text-gray-900">
				{workItemId || "Work Item Details"}
			</h2>
			<button
				onClick={onClose}
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
	);
};

export default ModalHeader;
