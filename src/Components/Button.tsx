import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{
	className?: string;
	label?: string;
	onClick?: () => void;
}>;

const Button = ({ children, className, label, onClick }: Props) => {
	return (
		<Styles
			className={className}
			onClick={(ev) => {
				ev.preventDefault();
				onClick?.();
			}}
		>
			{label ?? children}
		</Styles>
	);
};

export { Button };

const Styles = styled.button`
	display: block;
	position: relative;
	font-weight: 400;
	padding: 1.25rem 1rem;
	padding-bottom: 1.325rem;
	line-height: 0;
	color: ${getCssVariable("Accent")};
	background-color: transparent;
	border-radius: 0.25rem;
	cursor: pointer;

	transition: background-color 0.125s linear, color 0.125s linear;

	&:before,
	&:after {
		display: block;
		position: absolute;
	}

	&:before {
		top: calc(50% + 0.0675rem);
	}

	&:after {
		top: 50%;
	}

	&:hover {
		color: ${getCssVariable("Background")};
		background-color: ${getCssVariable("Cyan")};
	}
`;
