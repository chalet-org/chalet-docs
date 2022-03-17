import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

import { Container } from "./Container";
import { StickyBackground } from "./StickyBackground";

type Props = {};

const PageFooter = (_props: Props) => {
	return (
		<Styles>
			<Background />
			<Container>Footer</Container>
		</Styles>
	);
};

export { PageFooter };

const Styles = styled.footer`
	display: block;
	position: relative;
	width: 100%;
	height: 22rem;
	padding: 1rem 0;
`;

const Background = styled.div`
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: ${getThemeVariable("codeBackground")};
	opacity: 50%;
`;
