import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getCssVariable, Theme } from "Theme";

import { Icon } from "./Icon";

const color = getCssVariable("MainText");

type Props = {};

const ThemeToggle = (props: Props) => {
	const { setTheme, themeID } = useUiStore();
	return (
		<Styles className="theme-toggle" onClick={() => setTheme(themeID === Theme.Light ? Theme.Dark : Theme.Light)}>
			<Icon id={themeID === Theme.Light ? "night" : "day"} size="2rem" color={color} />
		</Styles>
	);
};

export { ThemeToggle };

const Styles = styled.button`
	background: none;
	cursor: pointer;
	opacity: 0.25;
	transition: opacity 0.125s linear;

	> i > svg {
		> path,
		> circle {
			transition: fill 0.125s linear;
		}
	}

	&:hover {
		opacity: 1;

		> i > svg {
			> path,
			> circle {
				fill: ${getCssVariable("Accent")} !important;
			}
		}
	}
`;
