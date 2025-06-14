"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRegister } from "@/lib/hooks/useAuth";
import type { RegisterCredentials } from "@/lib/api/auth.api";
import ErrorAlert from "./ErrorAlert";
import SocialLoginButtons from "./SocialLoginButtons";

export default function RegisterForm() {
	const registerMutation = useRegister();
	const [formData, setFormData] = useState<RegisterCredentials>({
		username: "",
		email: "",
		password: "",
		fullName: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		registerMutation.mutate(formData);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
			<form className="space-y-6" onSubmit={handleSubmit}>
				<ErrorAlert
					error={registerMutation.error}
					defaultMessage="Registration failed"
				/>

				<div className="space-y-4">
					<Input
						label="Full Name"
						name="fullName"
						type="text"
						required
						value={formData.fullName}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>

					<Input
						label="Username"
						name="username"
						type="text"
						required
						value={formData.username}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>

					<Input
						label="Email Address"
						name="email"
						type="email"
						required
						value={formData.email}
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

				<div className="flex items-start">
					<div className="flex items-center h-5">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							required
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
					</div>
					<div className="ml-3 text-sm">
						<label htmlFor="terms" className="text-gray-600">
							I agree to the{" "}
							<Link href="/terms" className="text-blue-600 hover:text-blue-700">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link
								href="/privacy"
								className="text-blue-600 hover:text-blue-700"
							>
								Privacy Policy
							</Link>
						</label>
					</div>
				</div>

				<Button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
					isLoading={registerMutation.isPending}
					disabled={registerMutation.isPending}
				>
					{registerMutation.isPending
						? "Creating account..."
						: "Create Account"}
				</Button>
			</form>

			<SocialLoginButtons type="register" />
		</div>
	);
}
