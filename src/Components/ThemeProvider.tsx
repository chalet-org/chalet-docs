import React from "react";
import { createGlobalStyle } from "styled-components";

import { useUiStore } from "Stores";
import { getRootThemeCss, ThemeType } from "Theme";

type StyleProps = {
	theme: ThemeType;
};

const GlobalCssVariables: any = createGlobalStyle<StyleProps>`
	:root {
		${({ theme }: StyleProps) => getRootThemeCss(theme)}
	}
`;

const ThemeProvider = () => {
	const { theme } = useUiStore();

	return <GlobalCssVariables theme={theme} />;
};

export { ThemeProvider };
