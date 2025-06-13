"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLogin } from "@/lib/hooks/useAuth";
import type { LoginCredentials } from "@/lib/api/auth.api";

export default function LoginPage() {
	const loginMutation = useLogin();
	const [formData, setFormData] = useState<LoginCredentials>({
		username: "",
		password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate(formData);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
			{/* Header */}
			<header className="w-full px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between max-w-7xl mx-auto">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
							<svg
								className="w-5 h-5 text-white"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M12.5 2C13.3 2 14 2.7 14 3.5V11H21.5C22.3 11 23 11.7 23 12.5S22.3 14 21.5 14H14V21.5C14 22.3 13.3 23 12.5 23S11 22.3 11 21.5V14H3.5C2.7 14 2 13.3 2 12.5S2.7 11 3.5 11H11V3.5C11 2.7 11.7 2 12.5 2Z" />
							</svg>
						</div>
						<span className="text-xl font-bold text-gray-900">Jira</span>
					</div>
					<div className="text-sm text-gray-600">
						Can't log in?{" "}
						<Link href="/help" className="text-blue-600 hover:text-blue-700">
							Get help
						</Link>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					{/* Logo and Title */}
					<div className="text-center">
						<div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg">
							<svg
								className="w-10 h-10 text-white"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M12.5 2C13.3 2 14 2.7 14 3.5V11H21.5C22.3 11 23 11.7 23 12.5S22.3 14 21.5 14H14V21.5C14 22.3 13.3 23 12.5 23S11 22.3 11 21.5V14H3.5C2.7 14 2 13.3 2 12.5S2.7 11 3.5 11H11V3.5C11 2.7 11.7 2 12.5 2Z" />
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Log in to your account
						</h1>
						<p className="text-gray-600">
							Enter your credentials to access your workspace
						</p>
					</div>

					{/* Login Form */}
					<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
						<form className="space-y-6" onSubmit={handleSubmit}>
							{loginMutation.error && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4">
									<div className="flex items-center">
										<svg
											className="w-5 h-5 text-red-400 mr-3"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clipRule="evenodd"
											/>
										</svg>
										<span className="text-red-700 text-sm font-medium">
											{loginMutation.error instanceof Error
												? loginMutation.error.message
												: "Login failed"}
										</span>
									</div>
								</div>
							)}

							<div className="space-y-4">
								<Input
									label="Username or email"
									name="username"
									type="text"
									required
									value={formData.username}
									onChange={handleChange}
									className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>

								<Input
									label="Password"
									name="password"
									type="password"
									required
									value={formData.password}
									onChange={handleChange}
									className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div className="flex items-center justify-between">
								<label className="flex items-center">
									<input
										type="checkbox"
										className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
									/>
									<span className="ml-2 text-sm text-gray-600">
										Remember me
									</span>
								</label>
								<Link
									href="/auth/forgot-password"
									className="text-sm text-blue-600 hover:text-blue-700"
								>
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
								isLoading={loginMutation.isPending}
								disabled={loginMutation.isPending}
							>
								{loginMutation.isPending ? "Signing in..." : "Sign in"}
							</Button>
						</form>

						{/* Divider */}
						<div className="mt-6">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300" />
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-white text-gray-500">
										Or continue with
									</span>
								</div>
							</div>

							{/* Social Login Buttons */}
							<div className="mt-6 grid grid-cols-2 gap-3">
								<button
									type="button"
									className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="currentColor"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="currentColor"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="currentColor"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									<span className="ml-2">Google</span>
								</button>

								<button
									type="button"
									className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
								>
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
									</svg>
									<span className="ml-2">Facebook</span>
								</button>
							</div>
						</div>
					</div>

					{/* Sign up link */}
					<div className="text-center">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<Link
								href="/auth/register"
								className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
							>
								Sign up for free
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Footer */}
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
		</div>
	);
}
