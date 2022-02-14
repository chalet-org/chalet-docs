import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const ImportantNote = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { ImportantNote };

const Styles = styled.div`
	display: block;
	background-color: ${getThemeVariable("codeBackground")};
	border: 0.125rem solid ${getThemeVariable("border")};
	border-radius: 0.5rem;
	color: ${getThemeVariable("mainText")};
	margin: 0.75rem 0;
	padding: 1rem 1.25rem;
`;
