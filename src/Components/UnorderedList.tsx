import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const UnorderedList = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { UnorderedList };

const Styles = styled.ul`
	display: block;
	padding-left: 1rem;
	list-style-type: circle;

	> li {
		&::marker {
			color: ${getCssVariable("Yellow")};
		}
	}
`;
