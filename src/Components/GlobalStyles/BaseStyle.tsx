import { createGlobalStyle, css } from "styled-components";

import { darkTheme, getRootThemeCss, getThemeVariable, lightTheme, Theme } from "Theme";

import { globalFonts } from "./Fonts";
import { hasMinWidth } from "./Responsiveness";

const cssReset = css`
	*,
	::after,
	::before {
		box-sizing: border-box;
	}

	html,
	body,
	div,
	aside,
	main,
	code,
	pre {
		scrollbar-width: thin;
		scrollbar-color: ${getThemeVariable("border")} transparent;
	}

	*:focus-visible {
		position: relative;
		outline: 0.125rem solid ${getThemeVariable("primaryColor")};
		z-index: 10000;
		border-radius: 0.25rem;
	}

	::-webkit-scrollbar {
		width: 0.5rem;
		height: 0.5rem;
	}

	::-webkit-scrollbar-track-piece {
		background-color: transparent;
	}

	::-webkit-scrollbar-thumb {
		background-color: ${getThemeVariable("border")};

		&:hover {
			background-color: ${getThemeVariable("header")};
		}
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
	${cssReset};

	html {
		font-size: 14px;
		background-color: ${getThemeVariable("background")};
		scroll-behavior: smooth;
		width: 100%;
		display: block;
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

	div.table-container {
		width: 100%;
		overflow: auto;
		margin-top: 1rem;
		margin-bottom: 2rem;
		padding-left: 0.0675rem; /* This is kind of a hack to fix a weird table offset on the left */
	}

	table {
		/* min-width: 30rem; */
		max-width: calc(100% - 0.125rem);
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0 1rem;
		text-align: left;
		vertical-align: top;
		/* max-width: 24rem; */

		&:first-of-type {
			font-weight: 600;
			white-space: pre;
			/* min-width: 4rem; */
		}

		&:not(:first-of-type) {
			min-width: 8rem;
		}

		> strong {
			font-weight: 600;
		}
	}

	th {
		font-weight: 600;
		/* min-width: 12rem; */
	}

	td {
		border: 0.125rem solid ${getThemeVariable("border")};

		&:not(:first-of-type) {
			background-color: ${getThemeVariable("codeBackground")};
		}
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-family: ${globalFonts.header};
		font-weight: 500;
		margin: 0;
		padding-top: 0;
		padding-bottom: 0.75rem;
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
		height: 0.125rem;
		width: 100%;
		text-align: center;
		font-size: 1.125rem;

		&:before {
			content: " ";
			display: block;
			position: relative;
			top: 0.325rem;
			height: 0.0625rem;
			width: 100%;
			background-color: ${getThemeVariable("primaryColor")};
		}

		&:after {
			content: " ";
			display: block;
			position: relative;
			padding: 0 0;
			background: ${getThemeVariable("secondaryColor")};
			width: 0.666rem;
			height: 0.666rem;
			margin: 0 auto;
			transform: translateX(-50%) translateY(-2.5%) scaleX(8) scaleY(0.333) rotate(45deg);
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

	ul,
	ol {
		margin: 0;
		padding-top: 0.25rem;
		padding-bottom: 0.75rem;
		line-height: 1.625;
	}

	ol {
		padding-left: 1rem;
	}

	dl {
		padding-top: 0.5rem;
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

//
// Plain CSS only here
//
const rootStyles = css`
	html.${Theme.Light} {
		${getRootThemeCss(lightTheme)}

		background: ${lightTheme.background};
	}

	html.${Theme.Dark} {
		${getRootThemeCss(darkTheme)}

		background: ${darkTheme.background};
	}

	body {
		opacity: 0;
		transition: opacity 0.125s linear;
	}

	body.ready {
		opacity: 1;
	}
`;

export { rootStyles, BaseStyle };
