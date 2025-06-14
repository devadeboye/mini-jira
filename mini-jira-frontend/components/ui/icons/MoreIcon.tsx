import { SvgProp } from "@/types/icons";

const MoreIcon = ({ className, fill }: SvgProp) => {
	return (
		<svg
			fill={fill}
			viewBox="0 0 16 16"
			role="presentation"
			className={className}
		>
			<path
				fill={fill}
				fillRule="evenodd"
				d="M0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m6.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M13 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default MoreIcon;
