import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const UnorderedList = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { UnorderedList };

const Styles = styled.ul`
	display: block;
	padding-left: 0;
	list-style: none;

	> li {
		display: block;
		position: relative;
		padding-left: 1.5rem;

		&:before {
			display: block;
			position: absolute;
			content: "\u25AB";
			color: ${getThemeVariable("header")};
			font-size: 2rem;
			line-height: 0;
			left: 0;
			top: 0.875rem;
		}
	}
`;
