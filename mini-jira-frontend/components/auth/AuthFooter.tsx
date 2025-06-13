import Link from "next/link";

export default function AuthFooter() {
	return (
		<footer className="w-full px-4 py-6 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
					<div className="flex items-center space-x-6 text-sm text-gray-500">
						<Link
							href="/privacy"
							className="hover:text-gray-700 transition-colors duration-200"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-gray-700 transition-colors duration-200"
						>
							Terms of Service
						</Link>
						<Link
							href="/contact"
							className="hover:text-gray-700 transition-colors duration-200"
						>
							Contact
						</Link>
					</div>
					<div className="text-sm text-gray-500">
						© 2024 Mini Jira. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
