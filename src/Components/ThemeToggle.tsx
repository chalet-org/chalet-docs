import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

import { Icon } from "./Icon";

const color = getThemeVariable("header");

const ThemeToggle = () => {
	const { themeId, toggleTheme } = useUiStore();
	return (
		<Styles
			className="theme-toggle"
			onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
			onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
			onClick={toggleTheme}
			title="Theme toggle"
		>
			<Icon id={themeId} size="2rem" color={color} />
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
