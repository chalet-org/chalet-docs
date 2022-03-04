import { createGlobalStyle, css } from "styled-components";

import { getThemeVariable } from "Theme";

import { fontImports, globalFonts } from "./Fonts";
import { hasMinWidth } from "./Responsiveness";

const cssReset = css`
	*,
	::after,
	::before {
		box-sizing: border-box;
	}

	*:focus-visible {
		position: relative;
		outline: 0.125rem solid ${getThemeVariable("primaryColor")};
		z-index: 10000;
		border-radius: 0.25rem;
	}

	blockquote,
	body,
	dd,
	dl,
	figure,
	h1,
	h2,
	h3,
	h4,
	p {
		margin: 0;
	}

	ol[role="list"],
	ul[role="list"] {
		list-style: none;
	}

	html:focus-within {
		scroll-behavior: smooth;
	}

	body {
		min-height: 100vh;
		text-rendering: optimizeSpeed;
		line-height: 1.5;
	}

	a:not([class]) {
		text-decoration-skip-ink: auto;
	}

	img,
	picture {
		max-width: 100%;
		display: block;
	}

	button,
	input,
	select,
	textarea {
		font: inherit;
	}

	@media (prefers-reduced-motion: reduce) {
		html:focus-within {
			scroll-behavior: auto;
		}

		*,
		::after,
		::before {
			animation-duration: 0s !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0s !important;
			scroll-behavior: auto !important;
		}
	}
`;

const BaseStyle = createGlobalStyle`
    ${cssReset}
	${fontImports}

    html {
        font-size: 14px;
        background-color: ${getThemeVariable("background")};
		scroll-behavior: smooth;
		width: 100%;
		position: relative;
    }

    body {
        margin: 0;
        padding: 0;
		font-family: ${globalFonts.paragraph};
		font-size: 1.125rem;
		line-height: 1.625;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    code {
		font-family: ${globalFonts.code};
    }

    h1, h2, h3, h4, h5, h6 {
		font-family: ${globalFonts.header};
		font-weight: 500;
        margin: 0;
		padding-top: 0;
		padding-bottom: 0;
    }

	h1 {
		font-size: 2.25rem;
	}
	h2 {
		font-size: 1.825rem;
	}
	h3 {
		font-size: 1.5rem;
	}
	h4 {
		font-size: 1.25rem;
		line-height: 1.5;
	}
	h5 {
		font-size: 1.125rem;
		line-height: 1.5;
	}
	h6 {
		font-size: 0.875rem;
		line-height: 1.675;
	}

	p {
		padding-top: 0.25rem;
		padding-bottom: 0.75rem;
	}

	hr {
		border: none;
		outline: 0;
		background-color: ${getThemeVariable("border")};
		margin: 1rem auto;
		margin-bottom: 2rem;
		height: 0.0625rem;
		width: 100%;
		text-align: center;
		font-size: 1.125rem;

		&:before {
			content: ' ';
			display: block;
			position: relative;
			top: 0.325rem;
			height: 0.0625rem;
			width: 100%;
			background-color: ${getThemeVariable("border")};
		}

		&:after {
			content: 'Λ';
			display: inline-block;
			position: relative;
			top: -1.0675rem;
			padding: 0 0;
			background: ${getThemeVariable("background")};
			color: ${getThemeVariable("border")};
			font-size: 0.675rem;
			transform: scaleX(150%);
		}
	}

    a {
		cursor: pointer;
        text-decoration: none;
		color: ${getThemeVariable("secondaryColor")};
		transition: color 0.125s linear;

		&:hover,
		&.touch-hover {
			color: ${getThemeVariable("primaryColor")};
		}
    }

	ul,ol {
		margin: 0;
		padding-top: 0.25rem;
		padding-bottom: 0.75rem;
		line-height: 1.625;
	}

	ol {
		padding-left: 1rem;
	}

	dd {
		padding-left: 1.25rem;
		padding-bottom: 1rem;
	}

	button {
		border: none;
	}

	.router-progress-bar {
		z-index: 50;
		color: ${getThemeVariable("secondaryColor")} !important;
	}

	@media ${hasMinWidth(0)} {
		html {
        	font-size: 16px;
		}
	}
	@media ${hasMinWidth(1)} {
		/**/
	}
	@media ${hasMinWidth(2)} {
		/**/
	}
`;

export { BaseStyle };
