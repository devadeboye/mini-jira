import Link from "next/link";

export default function NewProjectCard() { 
  return (
		<Link href="/onboarding/create-project" className="block group">
			<div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 flex items-center justify-center min-h-[200px] transition-all duration-200 hover:border-blue-300 hover:shadow-md">
				<div className="text-center">
					<div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
					</div>
					<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
						Create New Project
					</h3>
					<p className="text-sm text-gray-500 mt-1">
						Start a new project from scratch
					</p>
				</div>
			</div>
		</Link>
	);
}