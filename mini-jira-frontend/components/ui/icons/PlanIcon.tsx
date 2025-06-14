import { SvgProp } from "@/types/icons";

const PlanIcon = ({ className, fill }: SvgProp) => {
	return (
		<svg
			fill={fill}
			viewBox="-4 -4 24 24"
			role="presentation"
			className={className}
		>
			<path
				fill={fill}
				fillRule="evenodd"
				d="M0 4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5zM3 11a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default PlanIcon;
