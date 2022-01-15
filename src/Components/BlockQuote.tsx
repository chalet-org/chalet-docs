import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = {
	children?: React.ReactNode;
};

const BlockQuote = (props: Props) => {
	return <Styles className="quote">{props.children}</Styles>;
};

export { BlockQuote };

const Styles = styled.blockquote`
	margin: 0.75rem 0;
	padding: 0.5rem;
	padding-left: 1.25rem;
	border-left: 0.25rem solid ${getCssVariable("tertiaryColor")};
	background-color: ${getCssVariable("codeBackground")};

	> p {
		font-size: 1rem;
		padding-top: 0.25rem;
		padding-bottom: 0.5rem;

		> code {
			font-size: 0.8125rem;
		}
	}

	> .quote {
		margin: 0.375rem 0;
		margin-left: -0.5rem;
	}
`;
