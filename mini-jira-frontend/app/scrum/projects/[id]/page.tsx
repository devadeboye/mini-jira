import ProjectHeader from "../project/ProjectHeader";
import ProjectNav from "../project/ProjectNav";
import SprintPanel from "../sprintPanel/SprintPanel";
import BacklogPanel from "../sprintPanel/BacklogPanel";

export default function Projects() {
	return (
		<>
			<ProjectHeader />
			<ProjectNav />
			<div className="p-6 space-y-8">
				<SprintPanel />
				<BacklogPanel />
			</div>
		</>
	);
}
