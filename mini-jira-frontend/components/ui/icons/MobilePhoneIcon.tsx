import { SvgProp } from "@/types/icons";

const MobilePhoneIcon = (props: SvgProp) => (
	<svg
		height="100%"
		fill="var(--primary)"
		{...props}
		viewBox="0 0 16 16"
		role="presentation"
	>
		<path
			fill="var(--primary)"
			fillRule="evenodd"
			d="M2.5 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2zm2-.5A.5.5 0 0 0 4 2v12a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5zM10 13H6v-1.5h4z"
			clipRule="evenodd"
		></path>
	</svg>
);

export default MobilePhoneIcon;
