import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { CodeTheme, PageTheme } from "Theme";

type Props = {};

const ThemeToggle = (props: Props) => {
	const { setTheme } = useUiStore();
	return (
		<Styles>
			<button onClick={() => setTheme(PageTheme.Dark, CodeTheme.Dark)}>Dark</button>
			<button onClick={() => setTheme(PageTheme.Light, CodeTheme.Light)}>Light</button>
		</Styles>
	);
};

export { ThemeToggle };

const Styles = styled.div`
	display: block;
`;
