import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const UnorderedList = ({ children }: Props) => {
	return <Styles className="has-bullet">{children}</Styles>;
};

const UnorderedListSchema = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { UnorderedList, UnorderedListSchema };

const Styles = styled.ul`
	display: block;
	position: relative;
	padding-left: 0;
	list-style: none;

	> li {
		display: block;
		position: relative;
	}

	&:not(.has-bullet) {
		padding-left: 0.75rem;
	}

	&.has-bullet {
		> li {
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
	}
`;
