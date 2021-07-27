import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { Theme } from "Theme";

type Props = {};

const ThemeToggle = (props: Props) => {
	const { setTheme } = useUiStore();
	return (
		<Styles>
			<button onClick={() => setTheme(Theme.Dark)}>Dark</button>
			<button onClick={() => setTheme(Theme.Light)}>Light</button>
		</Styles>
	);
};

export { ThemeToggle };

const Styles = styled.div`
	display: block;
`;
