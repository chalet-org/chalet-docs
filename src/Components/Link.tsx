import { default as NextLink, LinkProps as NextLinkProps } from "next/link";
import React from "react";
import styled from "styled-components";

type Props = React.PropsWithChildren<NextLinkProps>;

const Link = ({ children, ...props }: Props) => {
	return (
		<NextLink {...props} passHref>
			<Styles>{children}</Styles>
		</NextLink>
	);
};

export { Link };

const Styles = styled.a`
	display: inline-block;
	color: blue;
	font-weight: 600;

	&:hover {
		color: magenta;
	}
`;
