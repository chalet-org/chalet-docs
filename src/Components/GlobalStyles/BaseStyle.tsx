import { createGlobalStyle, css } from "styled-components";

import { globalFonts } from "./Fonts";

const cssReset = css`
	*,
	::after,
	::before {
		box-sizing: border-box;
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

	@font-face {
		font-family: 'Courier Prime Code';
		src: url('/fonts/CourierPrimeCode-Italic.woff2') format('woff2');
		font-weight: normal;
		font-style: italic;
		font-display: swap;
	}

	@font-face {
		font-family: 'Courier Prime Code';
		src: url('/fonts/CourierPrimeCode-Regular.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}



    html {
        font-size: 16px;
        background-color: #757575;
    }

    body {
        margin: 0;
        padding: 0;
		font-family: ${globalFonts.paragraph};
		font-size: 1.125rem;
		line-height: 1.375;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    code {
		font-family: ${globalFonts.code};
    }

    h1, h2, h3, h4, h5, h6 {
		font-family: ${globalFonts.header};
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.625rem;
		word-spacing: 0.25rem;
        margin: 0;
		padding-top: 0.25rem;
		padding-bottom: 0.75rem;
    }

	h1 {
		font-size: 4rem;
	}
	h2 {
		font-size: 3.25rem;
	}
	h3 {
		font-size: 2.625rem;
	}
	h4 {
		font-size: 2.125rem;
		line-height: 1.5;
	}
	h5 {
		font-size: 1.625rem;
		line-height: 1.5;
	}
	h6 {
		font-size: 1.25rem;
		line-height: 1.675;
	}

	p {
		padding-top: 0.25rem;
		padding-bottom: 0.75rem;
	}

    a {
        color: inherit;
        text-decoration: none;
    }

	.router-progress-bar {
		z-index: 50;
	}
`;
