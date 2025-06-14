import LoadingSpinner from "@/components/ui/LoadingSpinner";

const LoadingState = () => {
	return (
		<div className="flex items-center justify-center py-8">
			<LoadingSpinner />
			<span className="sr-only">Loading work item details</span>
		</div>
	);
};

export default LoadingState;
