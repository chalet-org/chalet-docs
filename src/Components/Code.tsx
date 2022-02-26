import copy from "copy-to-clipboard";
import Prism from "prismjs";
import "prismjs/components";
import React from "react";
import styled, { css } from "styled-components";

import { Dictionary } from "@rewrking/react-kitchen";

import { globalFonts } from "Components";
import { getThemeVariable } from "Theme";

Prism.languages.bash = {
	sudo: {
		pattern: /\b(sudo)\b/,
		greedy: true,
	},
	"bash-ellipsis": {
		pattern: /\.\.\./,
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

const CodeHeader = ({ children, lang }: CodeProps) => {
	return (
		<HeaderStyles fonts={globalFonts} data-lang={lang}>
			<code
				// className={`language-${lang}`}
				dangerouslySetInnerHTML={{
					__html: !!Prism.languages[lang]
						? Prism.highlight(children ?? "", Prism.languages[lang], lang)
						: children,
				}}
			/>
		</HeaderStyles>
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

export { Code, CodePre, CodeHeader, CodePreFromMarkdown };

const boldWeight: number = 800;

type StyleProps = {
	fonts?: Dictionary<string>;
};

const codeCss = css<StyleProps>`
	position: relative;
	color: ${getThemeVariable("codeWhite")};
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
			color: ${getThemeVariable("codeBlue")};
		}
		&.attr-name {
			color: ${getThemeVariable("codeGreen")};
		}
		&.attr-value {
			color: ${getThemeVariable("codeLightYellow")};
		}
		&.boolean {
			color: ${getThemeVariable("codeYellow")};
			font-weight: ${boldWeight};
		}
		&.builtin {
			color: ${getThemeVariable("codeCyan")};
		}
		&.cdata {
			color: ${getThemeVariable("codeGray")};
		}
		&.char {
			color: ${getThemeVariable("codeGreen")};
		}
		&.class-name {
			color: ${getThemeVariable("primaryColor")};
		}
		&.comment {
			color: ${getThemeVariable("codeGray")};
		}
		&.constant {
			color: ${getThemeVariable("codeRed")};
		}
		&.deleted {
			color: ${getThemeVariable("codeRed")};
		}
		&.doctype {
			color: ${getThemeVariable("codeGray")};
		}
		&.entity {
			color: ${getThemeVariable("codeWhite")};
		}
		&.function {
			color: ${getThemeVariable("codeBlue")};
		}
		&.important {
			color: ${getThemeVariable("codeYellow")};
		}
		&.inserted {
			color: ${getThemeVariable("codeGreen")};
		}
		&.keyword {
			color: ${getThemeVariable("codeYellow")};
			font-weight: ${boldWeight};
		}
		&.number {
			color: ${getThemeVariable("codeCyan")};
		}
		&.operator {
			color: ${getThemeVariable("codeGray")};
		}
		&.prolog {
			color: ${getThemeVariable("codeGray")};
		}
		&.property {
			color: ${getThemeVariable("codeBlue")};
		}
		&.punctuation {
			color: ${getThemeVariable("codeGray")};
		}
		&.regex {
			color: ${getThemeVariable("codeYellow")};
		}
		&.selector {
			color: ${getThemeVariable("codeGreen")};
		}
		&.string {
			color: ${getThemeVariable("codeGreen")};
		}
		&.symbol {
			color: ${getThemeVariable("codeRed")};
		}
		&.tag {
			color: ${getThemeVariable("codeRed")};
		}
		&.url {
			color: ${getThemeVariable("codeWhite")};
		}
		&.variable {
			color: ${getThemeVariable("codeWhite")};
		}
	}

	.language-cpp .token {
		&.directive-hash,
		&.directive.keyword {
			color: ${getThemeVariable("codeBlue")};
			font-weight: 400;

			+ .string {
				color: ${getThemeVariable("codeYellow")};
			}
		}
	}

	.language-bash .token {
		&.function,
		&.class-name,
		&.terminal-application {
			color: ${getThemeVariable("codeBlue")};
		}
		&.sudo {
			color: ${getThemeVariable("codeRed")};
		}
		&.chalet {
			color: ${getThemeVariable("codeYellow")};
			font-weight: 600;
		}
		&.chalet-cmd {
			color: ${getThemeVariable("codeBlue")};
			font-weight: 600;
		}
		&.chalet-toolchain-preset,
		&.chalet-architecture {
			color: ${getThemeVariable("codeWhite")};
		}
		&.bash-ellipsis {
			color: ${getThemeVariable("codeGray")};
		}
	}

	.language-json .token {
		&.json-ellipsis {
			color: ${getThemeVariable("codeGray")};
		}
	}

	.language-ini .token {
		&.section-name {
			color: ${getThemeVariable("codeGray")};
		}
		&.punctuation-semicolon {
			color: ${getThemeVariable("codeGray")};
		}
		&.key {
			color: ${getThemeVariable("codeBlue")};
		}
		&.value {
			color: ${getThemeVariable("codeWhite")};
		}
		&.chalet-value-substitution {
			color: ${getThemeVariable("codeCyan")};
		}
	}

	.language-css .token.string {
		color: ${getThemeVariable("codeWhite")};
	}
	.style .token.string {
		color: ${getThemeVariable("codeWhite")};
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
	font-size: 0.875rem;
	font-weight: 400;
	background-color: ${getThemeVariable("codeBackground")};

	${codeCss}

	color: ${getThemeVariable("codeBlue")};
`;

const HeaderStyles = styled.dt<StyleProps>`
	display: block;
	/* max-height: 24rem; */
	font-size: 0.875rem;
	line-height: inherit;

	> code {
		line-height: 1.5;
		overflow: auto;
		font-weight: 800;
		background-color: ${getThemeVariable("codeBackground")};
		padding: 0.125rem 0.75rem;
		padding-top: 0.2rem;

		${codeCss}

		color: ${getThemeVariable("codeCyan")};
	}
`;

const PreStyles = styled.pre<StyleProps>`
	display: block;
	/* max-height: 24rem; */
	margin: 0.75rem 0;
	padding: 1rem 1.25rem;
	white-space: pre-wrap;
	line-height: 1.5;
	overflow: auto;
	font-size: 0.875rem;
	font-weight: 400;
	background-color: ${getThemeVariable("codeBackground")};

	${codeCss}

	&:after {
		content: attr(data-lang);
		color: ${getThemeVariable("codeGray")};
		display: block;
		position: absolute;
		top: 0.875rem;
		right: 1.25rem;
		font-family: ${(props) => props.fonts?.paragraph ?? "inherit"};
		font-size: 0.875rem;
		z-index: 10;
	}
`;
