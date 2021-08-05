import { createGlobalStyle, css } from "styled-components";

import { getCssVariable } from "Theme";

import { fontImports, globalFonts } from "./Fonts";

const cssReset = css`
	*,
	::after,
	::before {
		box-sizing: border-box;
		outline: 0;
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

export const BaseStyle = createGlobalStyle`
    ${cssReset}
	${fontImports}

    html {
        font-size: 16px;
        background-color: #111111;
		scroll-behavior: smooth;
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
		font-size: 3rem;
	}
	h2 {
		font-size: 2.375rem;
	}
	h3 {
		font-size: 2rem;
	}
	h4 {
		font-size: 1.625rem;
		line-height: 1.5;
	}
	h5 {
		font-size: 1.375rem;
		line-height: 1.5;
	}
	h6 {
		font-size: 1.125rem;
		line-height: 1.675;
	}

	p {
		padding-top: 0.25rem;
		padding-bottom: 0.75rem;
	}

	hr {
		border: none;
		outline: 0;
		background-color: ${getCssVariable("Border")};
		margin: 1rem auto;
		margin-bottom: 2rem;
		height: 0.0625rem;
		width: 100%;
		text-align: center;

		&:before {
			content: ' ';
			display: block;
			position: relative;
			top: 0.325rem;
			height: 0.0625rem;
			width: 100%;
			background-color: ${getCssVariable("Border")};
		}

		&:after {
			content: 'Λ';
			display: inline-block;
			position: relative;
			top: -1.0675rem;
			padding: 0 0;
			background: ${getCssVariable("Background")};
			color: ${getCssVariable("Border")};
			font-size: 0.675rem;
			transform: scaleX(150%);
		}
	}

    a {
		cursor: pointer;
        text-decoration: none;
		color: ${getCssVariable("Accent")};
		transition: color 0.125s linear;

		&:hover {
			color: ${getCssVariable("Cyan")};
		}
    }

	ul {
		margin: 0;
		padding-top: 0.25rem;
		padding-bottom: 0.75rem;
		line-height: 1.625;
	}

	button {
		border: none;
	}

	.router-progress-bar {
		z-index: 50;
	}
`;
