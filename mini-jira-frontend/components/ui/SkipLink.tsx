import React from "react";

interface SkipLinkProps {
	href: string;
	children: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
	return (
		<a
			href={href}
			className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
			onFocus={(e) => {
				// Ensure the skip link is visible when focused
				e.currentTarget.classList.remove("sr-only");
			}}
			onBlur={(e) => {
				// Hide the skip link when focus is lost
				e.currentTarget.classList.add("sr-only");
			}}
		>
			{children}
		</a>
	);
};

export default SkipLink;
