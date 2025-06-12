import { SvgProp } from "@/types/icons";

const ViewAllProjects = ({ className = "", fill }: SvgProp) => {
	return (
		<svg
			width="100%"
			height="100%"
			fill={fill}
			viewBox="0 0 16 16"
			role="presentation"
			className={className}
		>
			<path
				fill={fill}
				fillRule="evenodd"
				d="M15 3.5H1V2h14zm0 5.25H1v-1.5h14zM8 14H1v-1.5h7z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default ViewAllProjects;
