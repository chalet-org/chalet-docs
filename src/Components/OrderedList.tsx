import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const OrderedList = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { OrderedList };

const Styles = styled.ol`
	display: block;
	padding-left: 0;
	list-style: none;
	counter-reset: ordered-list-count;

	li {
		display: block;
		position: relative;
		padding-left: 1.5rem;
		counter-increment: ordered-list-count;

		&:before {
			display: block;
			position: absolute;
			content: counter(ordered-list-count) ". ";
			color: ${getCssVariable("header")};
			line-height: inherit;
			line-height: 0;
			left: 0;
			top: 1rem;
		}
	}
`;
