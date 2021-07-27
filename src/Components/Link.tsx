import { default as NextLink, LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

type Props = React.PropsWithChildren<NextLinkProps> & {
	showActive?: boolean;
};

const Link = ({ children, ...props }: Props) => {
	const router = useRouter();

	const showActive = props.showActive ?? true;

	return (
		<NextLink {...props} passHref scroll={false}>
			<Styles className={router.asPath === props.href && showActive ? "active" : ""}>{children}</Styles>
		</NextLink>
	);
};

export { Link };

const Styles = styled.a`
	display: inline-block;
	font-weight: 600;
`;
