import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { CodeThemeType } from "Theme";

type Props = {
	children?: React.ReactNode;
};

const BlockQuote = (props: Props) => {
	const { codeTheme } = useUiStore();
	return (
		<Styles {...codeTheme} className="quote">
			<blockquote>{props.children}</blockquote>
		</Styles>
	);
};

export { BlockQuote };

const Styles = styled.div<CodeThemeType>`
	display: block;
	margin: 0.75rem 0;
	padding: 0;
	background-color: ${(theme) => theme.background};
	border: 0.125rem solid ${(theme) => theme.border};
	border-radius: 0.5rem;
	overflow: hidden;

	> blockquote {
		padding: 0.75rem;
		padding-left: 1.25rem;
		border-left: 0.25rem solid ${(theme) => theme.accent};

		> p {
			font-size: 1.25rem;
			padding-top: 0.25rem;
			padding-bottom: 0.5rem;
		}

		> .quote {
			margin: 0.375rem 0;
			margin-left: -0.5rem;
		}
	}
`;
