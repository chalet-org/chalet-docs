import copy from "copy-to-clipboard";
import Prism from "prismjs";
import "prismjs/components";
import React from "react";
import styled, { css } from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { globalFonts } from "Components";
import { useUiStore } from "Stores";
import { CodeThemeType } from "Theme";

type Props = React.PropsWithChildren<{
	lang: string;
}>;

const Code = ({ children, ...props }: Props) => {
	const { codeTheme } = useUiStore();

	return (
		<CodeStyles
			{...codeTheme}
			onClick={() => {
				if (children) {
					copy(`${children}`);
				}
			}}
		>
			{children}
		</CodeStyles>
	);
};

type CodeProps = Props & {
	children: string;
};

const CodePre = ({ children, lang }: CodeProps) => {
	const { codeTheme } = useUiStore();

	return (
		<PreStyles {...codeTheme} fonts={globalFonts} data-lang={lang}>
			<code
				className={`language-${lang}`}
				dangerouslySetInnerHTML={{
					__html: !!Prism.languages[lang]
						? Prism.highlight(children ?? "", Prism.languages[lang], lang)
						: children,
				}}
			/>
		</PreStyles>
	);
};

const CodePreFromMarkdown = ({ children, ...props }: Props) => {
	const { codeTheme } = useUiStore();

	return (
		<>
			{React.Children.map(children, (child) => {
				if (!child || typeof child == "number" || typeof child == "boolean" || typeof child == "string")
					return null;

				const { props: childProps } = child as any;

				// This is weird, but next-mdx-remote does some funky stuff with the component
				const lang = props.lang ?? childProps?.className.replace?.(/( |language-)/g, "") ?? "";

				return (
					<PreStyles {...codeTheme} fonts={globalFonts} data-lang={lang}>
						<code
							className={`language-${lang}`}
							dangerouslySetInnerHTML={{
								__html: !!Prism.languages[lang]
									? Prism.highlight(
											(childProps?.children as string) ?? "",
											Prism.languages[lang],
											lang
									  )
									: childProps?.children,
							}}
						/>
					</PreStyles>
				);
			})}
		</>
	);
};

export { Code, CodePre, CodePreFromMarkdown };

const boldWeight: number = 800;

type StyleProps = CodeThemeType & {
	fonts?: Dictionary<string>;
};

const codeCss = css<StyleProps>`
	position: relative;
	overflow: auto;
	background-color: ${(theme) => theme.background};
	border: 0.125rem solid ${(theme) => theme.border};
	border-radius: 0.5rem;
	color: ${(theme) => theme.white};
	font-size: 0.875rem;
	font-weight: 400;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;
	tab-size: 4;
	hyphens: none;
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
			font-weight: 800;
		}
		&.italic {
			font-style: italic;
		}

		&.entity {
			cursor: help;
		}

		&.atrule {
			color: ${(theme) => theme.blue};
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
			color: ${(theme) => theme.cyan};
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

const CodeStyles = styled.code<StyleProps>`
	display: inline;
	padding: 0 0.5rem;
	padding-top: 0.325rem;
	padding-bottom: 0.175rem;
	margin: 0 0.25rem;
	font-size: 0.75rem;
	vertical-align: middle;

	${codeCss}

	color: ${(theme) => theme.blue};
`;

const PreStyles = styled.pre<StyleProps>`
	display: block;
	/* max-height: 24rem; */
	margin: 0.75rem 0;
	padding: 1rem 1.25rem;

	${codeCss}

	&:after {
		content: attr(data-lang);
		color: ${(theme) => theme.accent};
		display: block;
		position: absolute;
		top: 0.75rem;
		right: 1.25rem;
		font-family: ${(props) => props.fonts?.paragraph ?? "inherit"};
		font-size: 1rem;
	}
`;
