import React from "react";
import styled, { keyframes } from "styled-components";

type Props = {
	color: string;
};

const TerminalCursor = ({ color }: Props) => {
	return <Styles $color={color} />;
};

export { TerminalCursor };

type StyleProps = {
	$color: string;
};

const rotate = keyframes`
	0% { opacity: 1; }
  	40% { opacity: 1; }
  	50% { opacity: 0; }
	90% { opacity: 0; }
	100% { opacity: 1; }
`;

const Styles = styled.span<StyleProps>`
	display: inline-block;
	position: relative;
	vertical-align: middle;
	width: 0.45em;
	height: 1.125em;
	top: -0.0625em;
	background-color: ${(p) => p.$color};
	opacity: 1;
	animation: ${rotate} 1s linear infinite;
	margin-left: 0.0625em;
`;
