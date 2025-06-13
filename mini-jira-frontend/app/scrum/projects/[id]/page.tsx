import ProjectHeader from "../project/ProjectHeader";
import ProjectNav from "../project/ProjectNav";
import SprintPanel from "../sprintPanel/SprintPanel";

export default function Projects() {
	return (
		<>
			<ProjectHeader />
			<ProjectNav />
			<div className="p-6">
				<SprintPanel />
			</div>
		</>
	);
}
