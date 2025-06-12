import ProjectHeader from "./ProjectHeader";
import ProjectNav from "./ProjectNav";
import SprintPanel from "./SprintPanel";

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
