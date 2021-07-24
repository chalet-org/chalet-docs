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
	margin: 0;
	padding: 0;
	background-color: ${(theme) => theme.background};
	border: 0.125rem solid ${(theme) => theme.border};
	border-radius: 0.5rem;
	overflow: hidden;

	> blockquote {
		padding: 1rem;
		padding-left: 1.5rem;
		border-left: 0.25rem solid ${(theme) => theme.accent};

		> .quote {
			margin: 1rem 0;
			margin-left: -0.5rem;
		}
	}
`;
