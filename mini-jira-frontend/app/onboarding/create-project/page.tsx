"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProject } from "@/lib/hooks/useProjects";
import type { CreateProjectDto } from "@/lib/api/projects.api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CreateProjectPage() {
	const router = useRouter();
	const createProject = useCreateProject();
	// TODO: Implement auth
	const user = { fullName: "User" };

	const [formData, setFormData] = useState<CreateProjectDto>({
		name: "",
		key: "",
		description: "",
		type: "scrum",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createProject.mutateAsync(formData);
			router.push("/projects");
		} catch (error) {
			console.error("Failed to create project:", error);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value as any }));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Welcome, {user.fullName}!
						</h1>
						<p className="mt-2 text-lg text-gray-600">
							Let's create your first project
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<Input
								label="Project name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								helperText="Give your project a descriptive name"
							/>

							<Input
								label="Project key"
								name="key"
								type="text"
								required
								value={formData.key}
								onChange={handleChange}
								className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								helperText="A short, unique identifier for your project (e.g., PROJ)"
							/>

							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700"
								>
									Description
								</label>
								<textarea
									id="description"
									name="description"
									rows={4}
									value={formData.description}
									onChange={handleChange}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
									placeholder="Describe your project's goals and scope"
								/>
							</div>

							<div>
								<label
									htmlFor="type"
									className="block text-sm font-medium text-gray-700"
								>
									Project type
								</label>
								<select
									id="type"
									name="type"
									value={formData.type}
									onChange={handleChange}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
								>
									<option value="scrum">Scrum</option>
									<option value="kanban">Kanban</option>
								</select>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
							isLoading={createProject.isPending}
							disabled={createProject.isPending}
							ariaLabel={
								createProject.isPending
									? "Creating project, please wait"
									: "Create project"
							}
						>
							{createProject.isPending
								? "Creating project..."
								: "Create project"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
