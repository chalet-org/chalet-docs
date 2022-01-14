import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const ImportantNote = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { ImportantNote };

const Styles = styled.div`
	display: block;
	background-color: ${getCssVariable("codeBackground")};
	border: 0.125rem solid ${getCssVariable("border")};
	border-radius: 0.5rem;
	color: ${getCssVariable("white")};
	margin: 0.75rem 0;
	padding: 1rem 1.25rem;
`;
