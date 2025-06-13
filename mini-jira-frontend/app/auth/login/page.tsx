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
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link
							href="/auth/register"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							create a new account
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{loginMutation.error && (
						<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
							{loginMutation.error instanceof Error
								? loginMutation.error.message
								: "Login failed"}
						</div>
					)}

					<Input
						label="Username"
						name="username"
						type="text"
						required
						value={formData.username}
						onChange={handleChange}
					/>

					<Input
						label="Password"
						name="password"
						type="password"
						required
						value={formData.password}
						onChange={handleChange}
					/>

					<Button
						type="submit"
						className="w-full"
						isLoading={loginMutation.isPending}
						disabled={loginMutation.isPending}
					>
						Sign in
					</Button>
				</form>
			</div>
		</div>
	);
}
