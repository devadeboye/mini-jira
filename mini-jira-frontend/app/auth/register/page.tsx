"use client";

import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthLogo from "@/components/auth/AuthLogo";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthFooter from "@/components/auth/AuthFooter";

export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
			<AuthHeader
				rightText="Already have an account?"
				rightLinkText="Sign in"
				rightLinkHref="/auth/login"
			/>

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
				<div className="w-full max-w-md space-y-8">
					<AuthLogo
						title="Create your account"
						subtitle="Join thousands of teams using Jira to get work done"
					/>

					<RegisterForm />

					{/* Sign in link */}
					<div className="text-center">
						<p className="text-gray-600">
							Already have an account?{" "}
							<Link
								href="/auth/login"
								className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>

			<AuthFooter />
		</div>
	);
}
