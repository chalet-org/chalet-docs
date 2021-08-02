import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const PageHeading = ({ children }: Props) => {
	return (
		<>
			<Styles>{children}</Styles>
			<hr />
		</>
	);
};

export { PageHeading };

const Styles = styled.h1`
	display: block;
	font-size: 5rem;
	line-height: 1;
	margin-left: -0.25rem;
	color: ${getCssVariable("Header")};
	padding: 0;
	text-transform: uppercase;
	letter-spacing: 0.625rem;
	word-spacing: 0.25rem;
`;
