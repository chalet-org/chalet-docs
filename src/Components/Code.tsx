import copy from "copy-to-clipboard";
import Prism from "prismjs";
import "prismjs/components";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-ini";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import React, { useState } from "react";
import styled, { css } from "styled-components";

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

Prism.languages.env = {
	"key-value": {
		pattern: /([A-Za-z_]+)(\=)(.*)/,
		greedy: true,
		inside: {
			key: {
				pattern: /^([A-Za-z_]+)\b/,
				greedy: true,
			},
			equals: {
				pattern: /=/,
				greedy: true,
			},
			value: {
				pattern: /(?!=)(.+)$/,
				greedy: true,
			},
		},
	},
};

type Props = React.PropsWithChildren<{
	lang?: string;
	copyButton?: boolean;
}>;

const Code = ({ children, ...props }: Props) => {
	return (
		<CodeStyles
		// onClick={() => {
		// 	if (children) {
		// 		copy(`${children}`);
		// 	}
		// }}
		>
			{children}
		</CodeStyles>
	);
};

const CodeHeader = ({ children }: React.PropsWithChildren<{}>) => {
	return (
		<HeaderStyles $fonts={globalFonts}>
			<code>{children}</code>
		</HeaderStyles>
	);
};

type CodeProps = Props & {
	className?: string;
	lang: string;
	textContent: string;
	copyButton: boolean;
};

const CodePre = ({ className, textContent, lang, copyButton }: CodeProps) => {
	const [showCopyButton, setShowCopyButton] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);

	return (
		<PreStyles
			data-lang={lang === "bash" ? "sh" : lang}
			$fonts={globalFonts}
			onMouseEnter={() => copyButton && setShowCopyButton(true)}
			onMouseLeave={() => {
				if (copyButton) {
					setShowCopyButton(false);
					setCopied(false);
				}
			}}
		>
			<pre className={className}>
				<code
					className={`language-${lang}`}
					dangerouslySetInnerHTML={{
						__html: !!Prism.languages[lang]
							? Prism.highlight(textContent, Prism.languages[lang], lang)
							: textContent,
					}}
				/>
			</pre>
			{showCopyButton && (
				<button
					onClick={(ev) => {
						ev.preventDefault();
						copy(textContent);
						setCopied(true);
					}}
				>
					{copied ? "Copied!" : "Copy"}
				</button>
			)}
		</PreStyles>
	);
};

const CodePreFromMarkdown = ({ children, ...props }: Props) => {
	return (
		<>
			{React.Children.map(children, (child) => {
				if (!child || typeof child === "number" || typeof child === "boolean" || typeof child === "string")
					return null;

				const { props: childProps } = child as any;

				// This is weird, but next-mdx-remote does some funky stuff with the component
				const lang = props.lang ?? childProps?.className?.replace?.(/( |language-)/g, "") ?? "";

				const copyButton = props.copyButton ?? false;

				return (
					<CodePre lang={lang} textContent={(childProps?.children as string) ?? ""} copyButton={copyButton} />
				);
			})}
		</>
	);
};

export { CodePre, Code, CodeHeader, CodePreFromMarkdown };

const boldWeight: number = 800;

type StyleProps = {
	$fonts?: typeof globalFonts;
};

const codeCss = css<StyleProps>`
	position: relative;
	color: ${getThemeVariable("codeWhite")};
	text-shadow: 0 0 1px rgba(255, 255, 255, 0.33);
	word-spacing: normal;
	white-space: pre;
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
			color: ${getThemeVariable("codeYellow")};
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
				color: ${getThemeVariable("primaryText")};
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
			font-weight: 700;
		}
		&.chalet-cmd {
			color: ${getThemeVariable("codeBlue")};
			font-weight: 700;
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

	.language-env .token {
		&.key {
			color: ${getThemeVariable("codeBlue")};
		}
		&.equals {
			color: ${getThemeVariable("codeGray")};
		}
		&.value {
			color: ${getThemeVariable("codeGreen")};
		}
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

const PreStyles = styled.div<StyleProps>`
	display: block;
	position: relative;
	width: 100%;

	> pre {
		display: block;
		position: relative;
		width: 100%;
		/* max-height: 24rem; */
		margin: 0.75rem 0;
		padding: 1rem 1.25rem;
		white-space: pre-wrap;
		line-height: 1.5;
		overflow: auto;
		font-size: 0.875rem;
		font-weight: 400;
		background-color: ${getThemeVariable("codeBackground")};

		&.small {
			font-size: 0.75rem;
		}

		${codeCss}
	}

	> button {
		display: block;
		position: absolute;
		top: 0.5rem;
		bottom: 0.5rem;
		right: 0.5rem;
		padding: 0.375rem 0.75rem;
		font-family: ${(p) => p.$fonts?.paragraph ?? "inherit"};
		font-size: 0.875rem;
		z-index: 20;
		background-color: ${getThemeVariable("codeBackground")};
		color: ${getThemeVariable("primaryColor")};
		border: 0.0675rem solid ${getThemeVariable("primaryColor")};
		border-radius: 0.25rem;
		cursor: pointer;
		transition:
			color 0.125s linear,
			border-color 0.125s linear,
			background-color 0.125s linear;

		&:hover {
			background-color: ${getThemeVariable("primaryColor")};
			color: ${getThemeVariable("codeBackground")};
			border-color: ${getThemeVariable("primaryColor")};
		}

		&:active {
			background-color: ${getThemeVariable("secondaryColor")};
			border-color: ${getThemeVariable("secondaryColor")};
		}
	}

	&:after {
		content: attr(data-lang);
		color: ${getThemeVariable("codeGray")};
		display: block;
		position: absolute;
		top: 0.875rem;
		right: 1.25rem;
		font-family: ${(p) => p.$fonts?.paragraph ?? "inherit"};
		font-size: 0.875rem;
		z-index: 10;
	}
`;
