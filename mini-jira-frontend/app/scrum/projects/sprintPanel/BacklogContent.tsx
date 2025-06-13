const BacklogContent = () => {
	return (
		<div className="px-2 w-full h-full">
			<div className="flex flex-row items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-lg w-full h-full py-8 px-6">
				<div className="flex flex-col items-center justify-center gap-4 mx-auto">
					{/* Content */}
					<p className="text-gray-600 text-xs leading-relaxed">
						Your backlog is empty.
					</p>
				</div>
			</div>
		</div>
	);
};

export default BacklogContent;
