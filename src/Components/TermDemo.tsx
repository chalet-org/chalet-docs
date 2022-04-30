import React from "react";
import styled from "styled-components";

import { useOperatingSystem } from "Hooks";
import { useUiStore } from "Stores";
import { getThemeVariable, Theme } from "Theme";

import { hasMinWidth } from "./GlobalStyles";

const TermDemo = () => {
	const { themeId } = useUiStore();
	const [os] = useOperatingSystem();
	return (
		<Styles>
			<DemoImageFrame>
				<DemoImage src={`/images/chalet-demo-${os}.gif`} alt="chalet" />
				<TerminalOverlay className={themeId} />
			</DemoImageFrame>
		</Styles>
	);
};

export { TermDemo };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const DemoImageFrame = styled.div`
	display: block;
	position: relative;
	background-color: black;
	border: 0.125rem solid ${getThemeVariable("border")};
	border-radius: 1rem;
	padding: 1rem;

	@media ${hasMinWidth(0)} {
		border-radius: 2rem;
		padding: 2rem 4rem;
	}
	@media ${hasMinWidth(1)} {
	}
	@media ${hasMinWidth(2)} {
	}
`;

const DemoImage = styled.img`
	display: block;
`;

const TerminalOverlay = styled.div`
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	border-radius: 0.875rem;
	padding: 1rem;
	pointer-events: none;

	&.${Theme.Light} {
		background: radial-gradient(rgba(255, 255, 255, 0.15) 25%, transparent 100%);
	}

	&.${Theme.Dark} {
		background: radial-gradient(rgba(255, 255, 255, 0.075) 25%, transparent 100%);
	}

	@media ${hasMinWidth(0)} {
		border-radius: 1.75rem;
		padding: 2rem 4rem;
	}
`;
