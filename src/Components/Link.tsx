import { default as NextLink, LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";

type Props = React.PropsWithChildren<NextLinkProps> & {
	showActive?: boolean;
	dataId?: string;
};

const Link = ({ children, dataId, ...props }: Props) => {
	const router = useRouter();

	const { focusedId, setFocusedId } = useUiStore();

	const showActive = props.showActive ?? true;
	const targetBlank = typeof props.href === "string" && props.href.startsWith("//");
	const href = typeof props.href === "string" && props.href.split("?")[0];
	const asPath = router.asPath.split("?")[0];

	return (
		<NextLink {...props} passHref scroll={false}>
			<Styles
				className={
					showActive &&
					((dataId === undefined && asPath === href && focusedId === "") ||
						(!!dataId && focusedId === dataId))
						? "active"
						: ""
				}
				target={targetBlank ? "_blank" : undefined}
				data-id={dataId}
				onClick={() => {
					setFocusedId(dataId ?? "");
				}}
			>
				{children}
			</Styles>
		</NextLink>
	);
};

export { Link };

const Styles = styled.a`
	display: inline-block;
	font-weight: 400;
`;
