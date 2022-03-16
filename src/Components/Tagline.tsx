import React from "react";
import styled from "styled-components";

type Props = React.PropsWithChildren<{}>;

const Tagline = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { Tagline };

const Styles = styled.h6`
	display: block;
	max-width: 80%;
	margin: 0 auto;
	text-align: center;
`;
