import { SvgProp } from "@/types/icons";

export default function HelpIcon({ className, fill }: SvgProp) {
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
				d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-3c-.586 0-1 .414-1 1H5.5c0-1.414 1.086-2.5 2.5-2.5s2.5 1.086 2.5 2.5c0 1.133-.713 1.706-1.162 2.058-.511.402-.588.494-.588.692v.75h-1.5v-.75c0-.977.689-1.507 1.078-1.806l.084-.065C8.838 6.544 9 6.367 9 6c0-.586-.414-1-1-1"
				clipRule="evenodd"
			></path>
			<path fill={fill} d="M9 11.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path>
		</svg>
	);
}
