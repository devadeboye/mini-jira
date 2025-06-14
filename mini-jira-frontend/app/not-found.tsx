"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import JiraLogo from "@/components/ui/icons/JiraLogo";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full text-center space-y-8">
				{/* Jira Logo */}
				<div className="mx-auto w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-lg">
					<JiraLogo width={64} height={64} />
				</div>

				{/* 404 Number */}
				<div className="space-y-4">
					<h1 className="text-8xl font-bold text-blue-600 tracking-tight">
						404
					</h1>
					<h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
					<p className="text-gray-600 text-lg leading-relaxed">
						Sorry, we couldn't find the page you're looking for. It might have
						been moved, deleted, or you entered the wrong URL.
					</p>
				</div>

				{/* Help Links - Better spacing */}
				<div className="pt-12 mt-8 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-6">
						Need help? Try these resources:
					</p>
					<div className="flex flex-wrap justify-center gap-6 text-sm">
						<Link
							href="/help"
							className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
						>
							Help Center
						</Link>
						<Link
							href="/contact"
							className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
						>
							Contact Support
						</Link>
						<Link
							href="/docs"
							className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
						>
							Documentation
						</Link>
					</div>
				</div>

				{/* Footer */}
				<div className="pt-8">
					<p className="text-xs text-gray-400">
						© 2024 Mini Jira. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}
