import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const PageHeading = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { PageHeading };

const Styles = styled.h1`
	display: block;
	font-size: 6rem;
	margin-left: -0.25rem;
	color: ${getCssVariable("Header")};
	padding: 0;
	padding-top: 2rem;
	border-bottom: 0.125rem solid ${getCssVariable("Border")};
	margin-bottom: 1rem;
	text-transform: uppercase;
	letter-spacing: 0.625rem;
	word-spacing: 0.25rem;
`;
