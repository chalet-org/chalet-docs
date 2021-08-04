import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{
	label?: string;
}>;

const IndentGroup = ({ label, children }: Props) => {
	return (
		<>
			{!!label && <IndentLabel>{label}:</IndentLabel>}
			<Styles className="indent">{children}</Styles>
		</>
	);
};

export { IndentGroup };

const Styles = styled.div`
	display: block;
	position: relative;
	padding-left: 1.25rem;
	border-left: 0.125rem solid ${getCssVariable("Border")};
`;

const IndentLabel = styled.div`
	display: block;
	position: relative;
	color: ${getCssVariable("Header")};
	/* padding-top: 0.25rem; */
	padding-top: 0;
	padding-bottom: 0.5rem;
`;
