import { css } from "styled-components";

import { Dictionary } from "@rewrking/react-kitchen";

const globalFonts: Dictionary<string> = {
	header: '"Poppins", sans-serif',
	paragraph: '"Barlow Semi Condensed", sans-serif',
	code: '"Courier Prime Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
};

const fontImports = css`
	@font-face {
		font-family: "Courier Prime Code";
		src: url("/fonts/CourierPrimeCode-Italic.woff2") format("woff2");
		font-weight: normal;
		font-style: italic;
		font-display: swap;
	}

	@font-face {
		font-family: "Courier Prime Code";
		src: url("/fonts/CourierPrimeCode-Regular.woff2") format("woff2");
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}
`;

export { globalFonts, fontImports };
