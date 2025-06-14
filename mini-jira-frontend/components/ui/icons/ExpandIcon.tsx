import { SvgProp } from "@/types/icons";

const ExpandIcon = ({ className, fill }: SvgProp) => {
	return (
		<svg
			fill={fill}
			viewBox="-4 -4 24 24"
			role="presentation"
			className={className}
		>
			<path
				fill="currentcolor"
				fillRule="evenodd"
				d="M14.78 2.28 9.53 7.53 8.47 6.47l5.25-5.25zM1.22 13.72l5.25-5.25 1.06 1.06-5.25 5.25z"
				clipRule="evenodd"
			></path>
			<path
				fill="currentcolor"
				fillRule="evenodd"
				d="M9.5 1h4.75a.75.75 0 0 1 .75.75V6.5h-1.5v-4h-4zm-7 12.5v-4H1v4.75c0 .414.336.75.75.75H6.5v-1.5z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default ExpandIcon;
