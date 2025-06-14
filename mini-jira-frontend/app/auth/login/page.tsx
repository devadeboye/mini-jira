"use client";

import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthLogo from "@/components/auth/AuthLogo";
import LoginForm from "@/components/auth/LoginForm";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
			<AuthHeader
				rightText="Can't log in?"
				rightLinkText="Get help"
				rightLinkHref="/help"
			/>

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<AuthLogo
						title="Log in to your account"
						subtitle="Enter your credentials to access your workspace"
					/>

					<LoginForm />

					{/* Sign up link */}
					<div className="text-center">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<Link
								href="/auth/register"
								className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>

			<AuthFooter />
		</div>
	);
}
