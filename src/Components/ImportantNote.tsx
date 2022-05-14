import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const ImportantNote = ({ children }: Props) => {
	return (
		<Styles>
			<p>{children}</p>
		</Styles>
	);
};

export { ImportantNote };

const Styles = styled.div`
	display: block;
	margin: 0.75rem 0;
	padding: 0.5rem;
	padding-left: 1.25rem;
	border-left: 0.25rem solid ${getThemeVariable("primaryColor")};
	background-color: ${getThemeVariable("codeBackground")};
	/* padding: 1rem 1.25rem; */

	> p {
		font-size: 1rem;
		padding-top: 0.25rem;
		padding-bottom: 0.5rem;
	}
`;
