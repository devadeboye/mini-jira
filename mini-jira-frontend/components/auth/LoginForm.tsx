"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLogin } from "@/lib/hooks/useAuth";
import type { LoginCredentials } from "@/lib/api/auth.api";
import ErrorAlert from "./ErrorAlert";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm() {
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
		<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
			<form className="space-y-6" onSubmit={handleSubmit}>
				<ErrorAlert error={loginMutation.error} defaultMessage="Login failed" />

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
						<span className="ml-2 text-sm text-gray-600">Remember me</span>
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

			<SocialLoginButtons type="login" />
		</div>
	);
}
