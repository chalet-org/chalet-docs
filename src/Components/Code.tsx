import copy from "copy-to-clipboard";
import Prism from "prismjs";
import "prismjs/components";
import React from "react";
import styled, { css } from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { globalFonts } from "Components";
import { getCssVariable } from "Theme";

Prism.languages.bash = {
	sudo: {
		pattern: /\b(sudo)\b/,
		greedy: true,
	},
	...(Prism.languages.bash as any),
	"terminal-application": {
		pattern: /\b(pacman|xcode-select)\b/,
		greedy: true,
	},
	"chalet-outer": {
		pattern: /(chalet\b)\s(\w+)/,
		greedy: true,
		inside: {
			chalet: {
				pattern: /^chalet\b/,
				greedy: true,
			},
			"chalet-cmd": {
				pattern: /(\w+)/,
				greedy: true,
			},
		},
	},
	"chalet-toolchain-preset": {
		pattern: /\b(apple-llvm|llvm|vs-\/w+|gcc)\b/,
		greedy: true,
	},
	"chalet-architecture": {
		pattern: /\b(x86|x64|arm64|arm)\b/,
		greedy: true,
	},
};

Prism.languages.json = {
	...(Prism.languages.json as any),
	"json-ellipsis": {
		pattern: /\.\.\./,
		greedy: true,
	},
};

Prism.languages.ini = {
	"chalet-value-substitution": {
		pattern: /\$\{\b(\w+)\b\}/,
		greedy: true,
	},
	"punctuation-semicolon": {
		pattern: /;/,
		greedy: true,
	},
	...(Prism.languages.ini as any),
};

type Props = React.PropsWithChildren<{
	lang?: string;
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
	lang: string;
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
				const lang = props.lang ?? childProps?.className?.replace?.(/( |language-)/g, "") ?? "";

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
	background-color: ${getCssVariable("codeBackground")};
	color: ${getCssVariable("codeWhite")};
	font-size: 0.875rem;
	font-weight: 400;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
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
			color: ${getCssVariable("codeBlue")};
		}
		&.attr-name {
			color: ${getCssVariable("codeGreen")};
		}
		&.attr-value {
			color: ${getCssVariable("codeLightYellow")};
		}
		&.boolean {
			color: ${getCssVariable("codeYellow")};
			font-weight: ${boldWeight};
		}
		&.builtin {
			color: ${getCssVariable("codeCyan")};
		}
		&.cdata {
			color: ${getCssVariable("codeGray")};
		}
		&.char {
			color: ${getCssVariable("codeGreen")};
		}
		&.class-name {
			color: ${getCssVariable("primaryColor")};
		}
		&.comment {
			color: ${getCssVariable("codeGray")};
		}
		&.constant {
			color: ${getCssVariable("codeRed")};
		}
		&.deleted {
			color: ${getCssVariable("codeRed")};
		}
		&.doctype {
			color: ${getCssVariable("codeGray")};
		}
		&.entity {
			color: ${getCssVariable("codeWhite")};
		}
		&.function {
			color: ${getCssVariable("codeBlue")};
		}
		&.important {
			color: ${getCssVariable("codeYellow")};
		}
		&.inserted {
			color: ${getCssVariable("codeGreen")};
		}
		&.keyword {
			color: ${getCssVariable("codeYellow")};
			font-weight: ${boldWeight};
		}
		&.number {
			color: ${getCssVariable("codeCyan")};
		}
		&.operator {
			color: ${getCssVariable("codeGray")};
		}
		&.prolog {
			color: ${getCssVariable("codeGray")};
		}
		&.property {
			color: ${getCssVariable("codeCyan")};
		}
		&.punctuation {
			color: ${getCssVariable("codeGray")};
		}
		&.regex {
			color: ${getCssVariable("codeYellow")};
		}
		&.selector {
			color: ${getCssVariable("codeGreen")};
		}
		&.string {
			color: ${getCssVariable("codeGreen")};
		}
		&.symbol {
			color: ${getCssVariable("codeRed")};
		}
		&.tag {
			color: ${getCssVariable("codeRed")};
		}
		&.url {
			color: ${getCssVariable("codeWhite")};
		}
		&.variable {
			color: ${getCssVariable("codeWhite")};
		}
	}

	.language-cpp .token {
		&.directive-hash,
		&.directive.keyword {
			color: ${getCssVariable("codeMagenta")};
			font-weight: 400;

			+ .string {
				color: ${getCssVariable("codeMagenta")};
			}
		}
	}

	.language-bash .token {
		&.function,
		&.class-name,
		&.terminal-application {
			color: ${getCssVariable("codeBlue")};
		}
		&.sudo {
			color: ${getCssVariable("codeRed")};
			font-weight: 600;
		}
		&.chalet {
			color: ${getCssVariable("codeYellow")};
			font-weight: 600;
		}
		&.chalet-cmd {
			color: ${getCssVariable("codeGreen")};
		}
		&.chalet-toolchain-preset,
		&.chalet-architecture {
			color: ${getCssVariable("codeWhite")};
		}
	}

	.language-json .token {
		&.json-ellipsis {
			color: ${getCssVariable("codeGray")};
		}
	}

	.language-ini .token {
		&.section-name {
			color: ${getCssVariable("codeGray")};
		}
		&.punctuation-semicolon {
			color: ${getCssVariable("codeGray")};
		}
		&.key {
			color: ${getCssVariable("codeBlue")};
		}
		&.value {
			color: ${getCssVariable("codeWhite")};
		}
		&.chalet-value-substitution {
			color: ${getCssVariable("codeCyan")};
		}
	}

	.language-css .token.string {
		color: ${getCssVariable("codeWhite")};
	}
	.style .token.string {
		color: ${getCssVariable("codeWhite")};
	}
`;

const CodeStyles = styled.code<StyleProps>`
	display: inline-block;
	padding: 0 0.25rem;
	padding-top: 0.125rem;
	padding-bottom: 0;
	margin: 0;
	font-size: 0.75rem;
	vertical-align: middle;
	white-space: pre-wrap;
	line-height: inherit;
	overflow: hidden;

	${codeCss}

	color: ${getCssVariable("codeBlue")};
`;

const PreStyles = styled.pre<StyleProps>`
	display: block;
	/* max-height: 24rem; */
	margin: 0.75rem 0;
	padding: 1rem 1.25rem;
	white-space: pre-wrap;
	line-height: 1.5;
	overflow: auto;

	${codeCss}

	&:after {
		content: attr(data-lang);
		color: ${getCssVariable("codeGray")};
		display: block;
		position: absolute;
		top: 0.875rem;
		right: 1.25rem;
		font-family: ${(props) => props.fonts?.paragraph ?? "inherit"};
		font-size: 0.875rem;
		z-index: 10;
	}
`;
