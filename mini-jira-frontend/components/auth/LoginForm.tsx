"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/auth/ErrorAlert";
import SocialLoginButtons from "./SocialLoginButtons";
import { signIn } from 'next-auth/react';

interface LoginCredentials {
	username: string;
	password: string;
}

export default function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/projects';
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<LoginCredentials>({
		username: "",
		password: "",
	});
	const [rememberMe, setRememberMe] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const result = await signIn('credentials', {
				username: formData.username,
				password: formData.password,
				redirect: false,
			});

			if (result?.error) {
				setError(new Error('Invalid username or password'));
				return;
			}

			// Successful login - redirect to callback URL or projects page
			router.push(callbackUrl);
			router.refresh();
		} catch (err) {
			setError(new Error('An error occurred during login'));
		} finally {
			setLoading(false);
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
				aria-label="Sign in to your account"
			>
				<ErrorAlert error={error} defaultMessage="Login failed" />

				<fieldset className="space-y-4">
					<legend className="sr-only">Account credentials</legend>

					<Input
						label="Username or email"
						name="username"
						type="text"
						required
						value={formData.username}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						helperText="Enter your username or email address"
					/>

					<Input
						label="Password"
						name="password"
						type="password"
						required
						value={formData.password}
						onChange={handleChange}
						className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						helperText="Enter your password"
					/>
				</fieldset>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember-me"
							type="checkbox"
							checked={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded focus:ring-2"
							aria-describedby="remember-me-description"
						/>
						<label
							htmlFor="remember-me"
							className="ml-2 text-sm text-gray-600 cursor-pointer"
						>
							Remember me
						</label>
						<div id="remember-me-description" className="sr-only">
							Keep me signed in on this device
						</div>
					</div>

					<Link
						href="/auth/forgot-password"
						className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
						aria-label="Reset your password"
					>
						Forgot password?
					</Link>
				</div>

				<Button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
					isLoading={loading}
					disabled={loading}
					ariaLabel={
						loading ? "Signing in, please wait" : "Sign in to your account"
					}
				>
					{loading ? "Signing in..." : "Sign in"}
				</Button>
			</form>

			<SocialLoginButtons type="login" />
		</div>
	);
}
