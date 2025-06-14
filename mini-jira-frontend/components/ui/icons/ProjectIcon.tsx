import Image from "next/image";
import { IconType } from "@/types/icon";

const ProjectIcon: IconType = ({ className }) => (
	<div className={className}>
		<Image
			src="/assets/svg/10415.svg"
			alt="Project icon"
			height={20}
			width={20}
			className="rounded-sm"
		/>
	</div>
);

export default ProjectIcon;
