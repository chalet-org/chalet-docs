import React, { useEffect } from "react";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components";

type Props = {
	text: string;
	language: string;
};

const Code = ({ text, language }: Props) => {
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return (
		<Styles>
			<pre>
				<code className={`language-${language}`}>{text}</code>
			</pre>
		</Styles>
	);
};

export { Code };

const Styles = styled.div`
	display: block;

	code[class*="language-"],
	pre[class*="language-"] {
		color: #f8f8f2;
		background: none;
		font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
		font-size: 0.75rem;
		text-align: left;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
		line-height: 1.5;

		tab-size: 4;

		hyphens: none;
	}

	/* Code blocks */
	pre[class*="language-"] {
		padding: 1rem;
		margin: 0.5rem 0;
		overflow: auto;
		border-radius: 0.3rem;
	}

	:not(pre) > code[class*="language-"],
	pre[class*="language-"] {
		background: #272822;
	}

	/* Inline code */
	:not(pre) > code[class*="language-"] {
		padding: 0.1rem;
		border-radius: 0.3rem;
		white-space: normal;
	}

	.token {
		&.comment,
		&.prolog,
		&.doctype,
		&.cdata {
			color: #8292a2;
		}

		&.punctuation {
			color: #f8f8f2;
		}

		&.namespace {
			opacity: 0.7;
		}

		&.property,
		&.tag,
		&.constant,
		&.symbol,
		&.deleted {
			color: #f92672;
		}

		&.boolean,
		&.number {
			color: #ae81ff;
		}

		&.selector,
		&.attr-name,
		&.string,
		&.char,
		&.builtin,
		&.inserted {
			color: #a6e22e;
		}

		&.operator,
		&.entity,
		&.url,
		&.token.variable {
			color: #f8f8f2;
		}

		&.atrule,
		&.attr-value,
		&.function,
		&.class-name {
			color: #e6db74;
		}

		&.keyword {
			color: #66d9ef;
		}

		&.regex,
		&.important {
			color: #fd971f;
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
	}

	.language-css .token.string,
	.style .token.string {
		color: #f8f8f2;
	}
`;
