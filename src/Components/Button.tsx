import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

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
	line-height: 1;
	color: ${getThemeVariable("mainText")};
	background-color: transparent;
	border-radius: 0.25rem;
	cursor: pointer;

	transition: background-color 0.125s linear, color 0.125s linear;

	&:hover {
		color: ${getThemeVariable("background")};
		background-color: ${getThemeVariable("secondaryColor")};
	}
`;
