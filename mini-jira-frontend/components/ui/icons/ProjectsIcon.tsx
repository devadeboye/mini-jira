import { SvgProp } from "@/types/icons";

const ProjectsIcon = ({ className = "", fill }: SvgProp) => {
	return (
		<svg
			fill={fill}
			viewBox="0 0 20 20"
			role="presentation"
			width="100%"
			height="100%"
			className={className}
		>
			<path
				fill={fill}
				fillRule="evenodd"
				d="M13.5 3a.5.5 0 0 0-.5-.5h-2.482a.5.5 0 0 0-.354.146L7.78 5.03a.75.75 0 0 1-.53.22H3.018a.5.5 0 0 0-.354.146l-.353.354 1.72 1.72a.75.75 0 0 1 0 1.06l-2.25 2.25L.72 9.72 2.44 8 .72 6.28a.75.75 0 0 1 0-1.06l.884-.884a2 2 0 0 1 1.414-.586h3.921l2.165-2.164A2 2 0 0 1 10.518 1H13a2 2 0 0 1 2 2v2.482a2 2 0 0 1-.586 1.414L12.25 9.061v3.921a2 2 0 0 1-.586 1.415l-.884.883a.75.75 0 0 1-1.06 0L8 13.56l-1.72 1.72-1.06-1.06 2.25-2.25a.75.75 0 0 1 1.06 0l1.72 1.72.354-.354a.5.5 0 0 0 .146-.354V8.75a.75.75 0 0 1 .22-.53l2.384-2.384a.5.5 0 0 0 .146-.354zm-6.72 7.28-5 5-1.06-1.06 5-5z"
				clipRule="evenodd"
			></path>
			<path
				fill={fill}
				d="M12.5 4.625a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0"
			></path>
		</svg>
	);
};

export default ProjectsIcon;
