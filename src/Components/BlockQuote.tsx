import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = {
	children?: React.ReactNode;
};

const BlockQuote = (props: Props) => {
	return (
		<Styles className="quote">
			<blockquote>{props.children}</blockquote>
		</Styles>
	);
};

export { BlockQuote };

const Styles = styled.div`
	display: block;
	margin: 0.75rem 0;
	padding: 0;
	background-color: ${getCssVariable("BackgroundCode")};
	border: 0.125rem solid ${getCssVariable("Border")};
	border-radius: 0.5rem;
	overflow: hidden;

	> blockquote {
		padding: 0.75rem;
		padding-left: 1.25rem;
		border-left: 0.25rem solid ${getCssVariable("Accent")};

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
