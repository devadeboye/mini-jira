import { SvgProp } from "@/types/icons";

const FeedbackIcon = ({ className, fill }: SvgProp) => {
	return (
		<svg
			height="100%"
			width="100%"
			fill={fill}
			viewBox="0 0 16 16"
			role="presentation"
			className={className}
		>
			<path
				fill={fill}
				fillRule="evenodd"
				d="M13.5 3.096a.5.5 0 0 0-.686-.464L7.5 4.758v4.734l5.314 2.126a.5.5 0 0 0 .686-.464zm-6 8.012 4.757 1.903A2 2 0 0 0 15 11.154V3.096a2 2 0 0 0-2.743-1.857L6.606 3.5H3a2 2 0 0 0-2 2v3.25a2 2 0 0 0 2 2h.5V13a2 2 0 0 0 2 2h1.25a.75.75 0 0 0 .75-.75zM6 9.25H3a.5.5 0 0 1-.5-.5V5.5A.5.5 0 0 1 3 5h3zm0 1.5v2.75h-.5A.5.5 0 0 1 5 13v-2.25z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default FeedbackIcon;
