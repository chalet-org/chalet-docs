import React from "react";
import { createGlobalStyle } from "styled-components";

import { useUiStore } from "Stores";
import { ThemeType } from "Theme";

type Props = {};

const ThemeProvider = ({}: Props) => {
	const { theme } = useUiStore();

	return <GlobalCssVariables {...theme} />;
};

export { ThemeProvider };

const GlobalCssVariables = createGlobalStyle<ThemeType>`
	:root {
		--th-bg-body: ${(theme) => theme.bodyBackground};
		--th-bg-code: ${(theme) => theme.codeBackground};
		--th-bg: ${(theme) => theme.background};
		--th-main-text: ${(theme) => theme.mainText};
		--th-header: ${(theme) => theme.header};
		--th-border: ${(theme) => theme.border};
		--th-accent: ${(theme) => theme.accent};
		--th-black: ${(theme) => theme.black};
		--th-white: ${(theme) => theme.white};
		--th-gray: ${(theme) => theme.gray};
		--th-red: ${(theme) => theme.red};
		--th-light-red: ${(theme) => theme.lightRed};
		--th-green: ${(theme) => theme.green};
		--th-light-green: ${(theme) => theme.lightGreen};
		--th-yellow: ${(theme) => theme.yellow};
		--th-light-yellow: ${(theme) => theme.lightYellow};
		--th-blue: ${(theme) => theme.blue};
		--th-light-blue: ${(theme) => theme.lightBlue};
		--th-magenta: ${(theme) => theme.magenta};
		--th-light-magenta: ${(theme) => theme.lightMagenta};
		--th-cyan: ${(theme) => theme.cyan};
		--th-light-cyan: ${(theme) => theme.lightCyan};
	}
`;
