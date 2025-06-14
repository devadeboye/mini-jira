import { SvgProp } from "@/types/icons";

const BacklogIcon = ({ className, fill }: SvgProp) => {
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
				d="M1 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2.167h11V3a.5.5 0 0 0-.5-.5zm10.5 4.167h-11v2.666h11zm0 4.166h-11V13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default BacklogIcon;
