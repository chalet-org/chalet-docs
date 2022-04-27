import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

const StickyBackground = () => {
	return (
		<Styles>
			<div />
		</Styles>
	);
};

export { StickyBackground };

const Styles = styled.div`
	display: block;
	position: relative;
	width: 100%;
	overflow: hidden;
	margin-top: -28rem;

	> div {
		display: block;
		position: relative;
		width: 100vw;
		height: 30rem;
		background-color: ${getThemeVariable("background")};
		background: ${getThemeVariable("mainBackgroundUrl")};
		/* background by SVGBackgrounds.com */
		background-size: cover;
		background-position: -50vw -19rem;
		background-repeat: no-repeat;
		color: ${getThemeVariable("primaryText")};
		top: 0;
		left: 0;
		overflow: hidden;
	}
`;
