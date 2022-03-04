import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable, Theme } from "Theme";

import { Icon } from "./Icon";

const color = getThemeVariable("header");

type Props = {};

const ThemeToggle = (props: Props) => {
	const { setTheme, themeId } = useUiStore();
	return (
		<Styles
			className="theme-toggle"
			onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
			onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
			onClick={() => setTheme(themeId === Theme.Light ? Theme.Dark : Theme.Light)}
		>
			<Icon id={themeId === Theme.Light ? "night" : "day"} size="2rem" color={color} />
		</Styles>
	);
};

export { ThemeToggle };

const Styles = styled.button`
	background: none;
	cursor: pointer;
	padding: 0;

	> i > svg {
		> path,
		> circle {
			transition: fill 0.125s linear;
		}
	}

	&:hover,
	&.touch-hover {
		> i > svg {
			> path,
			> circle {
				fill: ${getThemeVariable("primaryColor")} !important;
			}
		}
	}
`;
