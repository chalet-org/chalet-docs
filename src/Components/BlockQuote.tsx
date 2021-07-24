import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { CodeThemeType } from "Theme";

type Props = {
	children?: React.ReactNode;
};

const BlockQuote = (props: Props) => {
	const { codeTheme } = useUiStore();
	return <Styles {...codeTheme}>{props.children}</Styles>;
};

export { BlockQuote };

const Styles = styled.blockquote<CodeThemeType>`
	display: block;
	padding: 1rem;
	border-left: 0.25rem solid ${(theme) => theme.accent};
	background-color: ${(theme) => theme.background};

	> blockquote {
		margin: 1rem 0;
	}
`;
