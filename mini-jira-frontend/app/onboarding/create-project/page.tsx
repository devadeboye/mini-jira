"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProject } from "@/lib/hooks/useProjects";
import { useAuthState } from "@/lib/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLogo from "@/components/auth/AuthLogo";
import ErrorAlert from "@/components/auth/ErrorAlert";
import type { CreateProjectDto } from "@/lib/api/projects.api";

export default function CreateProjectPage() {
	const router = useRouter();
	const { user } = useAuthState();
	const createProjectMutation = useCreateProject();

	const [formData, setFormData] = useState<CreateProjectDto>({
		name: "",
		key: "",
		description: "",
		type: "scrum",
	});

	// Redirect if user already has created a project
	if (user?.hasCreatedProject) {
		router.push("/projects");
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await createProjectMutation.mutateAsync(formData);
			// Only redirect after successful project creation and data refetch
			router.push("/projects");
		} catch (error) {
			// Error will be shown by ErrorAlert component
			console.error("Project creation failed:", error);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Auto-generate project key from name
		if (name === "name") {
			const key = value
				.toUpperCase()
				.replace(/[^A-Z0-9]/g, "")
				.slice(0, 10);
			setFormData((prev) => ({ ...prev, key }));
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<AuthLogo
					title="Create Your First Project"
					subtitle="Let's get you started with your first project"
				/>

				<div className="mt-8 bg-white rounded-xl shadow-xl border border-gray-100 p-8">
					<div className="mb-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">
							Project Details
						</h2>
						<p className="text-sm text-gray-600">
							Create a project to organize your work items and sprints.
						</p>
					</div>

					<form className="space-y-6" onSubmit={handleSubmit}>
						<ErrorAlert
							error={createProjectMutation.error}
							defaultMessage="Project creation failed"
						/>

						<div className="space-y-4">
							<Input
								label="Project Name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								placeholder="e.g., My Awesome Project"
								className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>

							<div>
								<Input
									label="Project Key"
									name="key"
									type="text"
									required
									value={formData.key}
									onChange={handleChange}
									placeholder="e.g., MAP"
									className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
								<p className="mt-1 text-xs text-gray-500">
									2-10 uppercase letters. Auto-generated from project name. Must
									be unique.
								</p>
							</div>

							<div>
								<label
									htmlFor="type"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Project Type
								</label>
								<select
									id="type"
									name="type"
									value={formData.type}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="scrum">Scrum</option>
									<option value="kanban">Kanban</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Description (Optional)
								</label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									rows={3}
									placeholder="Describe what this project is about..."
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
							isLoading={createProjectMutation.isPending}
							disabled={
								createProjectMutation.isPending ||
								!formData.name ||
								!formData.key
							}
						>
							{createProjectMutation.isPending
								? "Creating Project..."
								: "Create Project & Continue"}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-xs text-gray-500">
							You can create more projects later from the projects page.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
