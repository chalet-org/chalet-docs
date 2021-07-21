import React, { useEffect } from "react";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components";

type CodeTheme = {
	background: string;
	border: string;
	black: string;
	white: string;
	gray: string;
	red: string;
	lightRed: string;
	green: string;
	lightGreen: string;
	yellow: string;
	lightYellow: string;
	blue: string;
	lightBlue: string;
	magenta: string;
	lightMagenta: string;
	cyan: string;
	lightCyan: string;
};
const codeTheme: CodeTheme = {
	background: "#0a0a0a",
	border: "#1d1d1f",
	black: "#0a0a0a",
	white: "#dedede",
	gray: "#7d7d9b",
	red: "#ff4a98",
	lightRed: "#ff4a98",
	green: "#6ffba4",
	lightGreen: "#6ffba4",
	yellow: "#f6bb5e",
	lightYellow: "#f6bb5e",
	blue: "#45b8ff",
	lightBlue: "#45b8ff",
	magenta: "#f589ff",
	lightMagenta: "#f589ff",
	cyan: "#0afafa",
	lightCyan: "#0afafa",
};

type Props = {
	text: string;
	language: string;
};

const Code = ({ text, language }: Props) => {
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<Styles {...{ ...codeTheme }}>
			<code className={`language-${language}`}>{text}</code>
		</Styles>
	);
};

export { Code };

const boldWeight: number = 800;

const Styles = styled.pre<CodeTheme>`
	display: block;
	max-height: 24rem;
	overflow-x: hidden;
	overflow-y: scroll;
	background-color: ${(theme) => theme.background};
	border: 0.125rem solid ${(theme) => theme.border};
	border-radius: 0.5rem;
	color: ${(theme) => theme.white};
	font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
	font-size: 0.75rem;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;
	tab-size: 4;
	hyphens: none;
	margin: 0.5rem 0;
	padding: 1.25rem;
	outline: 0;

	/* Inline code */
	/*:not(pre) > code[class*="language-"] {
		padding: 0.1rem;
		border-radius: 0.3rem;
		white-space: normal;
	}*/

	.token {
		&.namespace {
			opacity: 0.7;
		}

		&.important,
		&.bold {
			font-weight: bold;
		}
		&.italic {
			font-style: italic;
		}

		&.entity {
			cursor: help;
		}

		&.atrule {
			color: ${(theme) => theme.lightYellow};
		}
		&.attr-name {
			color: ${(theme) => theme.green};
		}
		&.attr-value {
			color: ${(theme) => theme.lightYellow};
		}
		&.boolean {
			color: ${(theme) => theme.yellow};
			font-weight: ${boldWeight};
		}
		&.builtin {
			color: ${(theme) => theme.green};
		}
		&.cdata {
			color: ${(theme) => theme.gray};
		}
		&.char {
			color: ${(theme) => theme.green};
		}
		&.class-name {
			color: ${(theme) => theme.lightYellow};
		}
		&.comment {
			color: ${(theme) => theme.gray};
		}
		&.constant {
			color: ${(theme) => theme.red};
		}
		&.deleted {
			color: ${(theme) => theme.red};
		}
		&.doctype {
			color: ${(theme) => theme.gray};
		}
		&.entity {
			color: ${(theme) => theme.white};
		}
		&.function {
			color: ${(theme) => theme.blue};
		}
		&.important {
			color: ${(theme) => theme.yellow};
		}
		&.inserted {
			color: ${(theme) => theme.green};
		}
		&.keyword {
			color: ${(theme) => theme.yellow};
			font-weight: ${boldWeight};
		}
		&.number {
			color: ${(theme) => theme.cyan};
		}
		&.operator {
			color: ${(theme) => theme.gray};
		}
		&.prolog {
			color: ${(theme) => theme.gray};
		}
		&.property {
			color: ${(theme) => theme.blue};
		}
		&.punctuation {
			color: ${(theme) => theme.gray};
		}
		&.regex {
			color: ${(theme) => theme.yellow};
		}
		&.selector {
			color: ${(theme) => theme.green};
		}
		&.string {
			color: ${(theme) => theme.green};
		}
		&.symbol {
			color: ${(theme) => theme.red};
		}
		&.tag {
			color: ${(theme) => theme.red};
		}
		&.url {
			color: ${(theme) => theme.white};
		}
		&.variable {
			color: ${(theme) => theme.white};
		}
	}

	.language-css .token.string {
		color: ${(theme) => theme.white};
	}
	.style .token.string {
		color: ${(theme) => theme.white};
	}
`;
