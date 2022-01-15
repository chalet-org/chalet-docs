import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getCssVariable, Theme } from "Theme";

import { Icon } from "./Icon";

const color = getCssVariable("header");

type Props = {};

const ThemeToggle = (props: Props) => {
	const { setTheme, themeId } = useUiStore();
	return (
		<Styles className="theme-toggle" onClick={() => setTheme(themeId === Theme.Light ? Theme.Dark : Theme.Light)}>
			<Icon id={themeId === Theme.Light ? "night" : "day"} size="2rem" color={color} />
		</Styles>
	);
};

export { ThemeToggle };

const Styles = styled.button`
	background: none;
	cursor: pointer;

	> i > svg {
		> path,
		> circle {
			transition: fill 0.125s linear;
		}
	}

	&:hover {
		> i > svg {
			> path,
			> circle {
				fill: ${getCssVariable("primaryColor")} !important;
			}
		}
	}
`;
