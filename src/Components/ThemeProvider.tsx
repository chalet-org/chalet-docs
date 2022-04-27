import React from "react";
import { createGlobalStyle } from "styled-components";

import { useUiStore } from "Stores";
import { getRootThemeCss, ThemeType } from "Theme";

const GlobalCssVariables = createGlobalStyle<ThemeType>`
	:root {
		${getRootThemeCss}
	}
`;

const ThemeProvider = () => {
	const { theme } = useUiStore();

	return <GlobalCssVariables {...theme} />;
};

export { ThemeProvider };
