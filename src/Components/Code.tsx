import Prism from "prismjs";
import "prismjs/components";
import React, { useEffect } from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { CodeThemeType } from "Theme";

type Props = React.PropsWithChildren<{
	text?: string;
	type?: "pre";
	lang?: string;
	meta?: string;
}>;

const Code = ({ children, text, lang }: Props) => {
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	const { codeTheme } = useUiStore();

	return <Styles {...{ ...codeTheme }}>{text ?? children ?? ""}</Styles>;
};

export { Code };

const boldWeight: number = 800;

const Styles = styled.pre<CodeThemeType>`
	display: block;
	max-height: 24rem;
	overflow-x: hidden;
	overflow-y: auto;
	background-color: ${(theme) => theme.background};
	border: 0.125rem solid ${(theme) => theme.border};
	border-radius: 0.5rem;
	color: ${(theme) => theme.white};
	font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
	font-size: 0.75rem;
	font-weight: 300;
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
