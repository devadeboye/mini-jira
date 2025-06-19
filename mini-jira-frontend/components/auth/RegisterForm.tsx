"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorAlert from "./ErrorAlert";
import SocialLoginButtons from "./SocialLoginButtons";

interface RegisterCredentials {
	username: string;
	email: string;
	password: string;
	fullName: string;
}

export default function RegisterForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [formData, setFormData] = useState<RegisterCredentials>({
		username: "",
		email: "",
		password: "",
		fullName: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// TODO: Implement registration
			await new Promise((resolve) => setTimeout(resolve, 1000));
			router.push("/projects");
		} catch (err) {
			setError(err as Error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
			<form
				className="space-y-6"
				onSubmit={handleSubmit}
				noValidate
				aria-label="Create your account"
			>
				<ErrorAlert error={error} defaultMessage="Registration failed" />

				<fieldset className="space-y-4">
					<legend className="sr-only">Account information</legend>

					<Input
						label="Full name"
						name="fullName"
						type="text"
						required
						value={formData.fullName}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						helperText="Enter your full name"
					/>

					<Input
						label="Username"
						name="username"
						type="text"
						required
						value={formData.username}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						helperText="Choose a unique username"
					/>

					<Input
						label="Email"
						name="email"
						type="email"
						required
						value={formData.email}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						helperText="Enter your email address"
					/>

					<Input
						label="Password"
						name="password"
						type="password"
						required
						value={formData.password}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						helperText="Create a strong password"
					/>
				</fieldset>

				<Button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
					isLoading={isLoading}
					disabled={isLoading}
					ariaLabel={
						isLoading ? "Creating account, please wait" : "Create your account"
					}
				>
					{isLoading ? "Creating account..." : "Create account"}
				</Button>
			</form>

			<SocialLoginButtons type="register" />
		</div>
	);
}
