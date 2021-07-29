import copy from "copy-to-clipboard";
import Prism from "prismjs";
import "prismjs/components";
import React from "react";
import styled, { css } from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { globalFonts } from "Components";
import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{
	lang: string;
}>;

const Code = ({ children, ...props }: Props) => {
	return (
		<CodeStyles
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
	return (
		<PreStyles fonts={globalFonts} data-lang={lang}>
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
	return (
		<>
			{React.Children.map(children, (child) => {
				if (!child || typeof child == "number" || typeof child == "boolean" || typeof child == "string")
					return null;

				const { props: childProps } = child as any;

				// This is weird, but next-mdx-remote does some funky stuff with the component
				const lang = props.lang ?? childProps?.className.replace?.(/( |language-)/g, "") ?? "";

				return (
					<PreStyles fonts={globalFonts} data-lang={lang}>
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

type StyleProps = {
	fonts?: Dictionary<string>;
};

const codeCss = css<StyleProps>`
	position: relative;
	overflow: auto;
	background-color: ${getCssVariable("BackgroundCode")};
	color: ${getCssVariable("White")};
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
			color: ${getCssVariable("Blue")};
		}
		&.attr-name {
			color: ${getCssVariable("Green")};
		}
		&.attr-value {
			color: ${getCssVariable("LightYellow")};
		}
		&.boolean {
			color: ${getCssVariable("Yellow")};
			font-weight: ${boldWeight};
		}
		&.builtin {
			color: ${getCssVariable("Cyan")};
		}
		&.cdata {
			color: ${getCssVariable("Gray")};
		}
		&.char {
			color: ${getCssVariable("Green")};
		}
		&.class-name {
			color: ${getCssVariable("Blue")};
		}
		&.comment {
			color: ${getCssVariable("Gray")};
		}
		&.constant {
			color: ${getCssVariable("Red")};
		}
		&.deleted {
			color: ${getCssVariable("Red")};
		}
		&.doctype {
			color: ${getCssVariable("Gray")};
		}
		&.entity {
			color: ${getCssVariable("White")};
		}
		&.function {
			color: ${getCssVariable("Blue")};
		}
		&.important {
			color: ${getCssVariable("Yellow")};
		}
		&.inserted {
			color: ${getCssVariable("Green")};
		}
		&.keyword {
			color: ${getCssVariable("Yellow")};
			font-weight: ${boldWeight};
		}
		&.number {
			color: ${getCssVariable("Cyan")};
		}
		&.operator {
			color: ${getCssVariable("Gray")};
		}
		&.prolog {
			color: ${getCssVariable("Gray")};
		}
		&.property {
			color: ${getCssVariable("Blue")};
		}
		&.punctuation {
			color: ${getCssVariable("Gray")};
		}
		&.regex {
			color: ${getCssVariable("Yellow")};
		}
		&.selector {
			color: ${getCssVariable("Green")};
		}
		&.string {
			color: ${getCssVariable("Green")};
		}
		&.symbol {
			color: ${getCssVariable("Red")};
		}
		&.tag {
			color: ${getCssVariable("Red")};
		}
		&.url {
			color: ${getCssVariable("White")};
		}
		&.variable {
			color: ${getCssVariable("White")};
		}
	}

	.language-css .token.string {
		color: ${getCssVariable("White")};
	}
	.style .token.string {
		color: ${getCssVariable("White")};
	}
`;

const CodeStyles = styled.code<StyleProps>`
	display: inline;
	padding: 0 0.75rem;
	padding-top: 0.325rem;
	padding-bottom: 0.175rem;
	margin: 0 0.25rem;
	font-size: 0.75rem;
	vertical-align: middle;

	${codeCss}

	color: ${getCssVariable("Cyan")};
`;

const PreStyles = styled.pre<StyleProps>`
	display: block;
	/* max-height: 24rem; */
	margin: 0.75rem 0;
	padding: 1rem 1.25rem;
	border-radius: 0.5rem;
	border: 0.125rem solid ${getCssVariable("Border")};

	${codeCss}

	&:after {
		content: attr(data-lang);
		color: ${getCssVariable("Accent")};
		display: block;
		position: absolute;
		top: 0.875rem;
		right: 1.25rem;
		font-family: ${(props) => props.fonts?.paragraph ?? "inherit"};
		font-size: 0.875rem;
	}
`;
