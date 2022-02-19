import { default as NextLink, LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";

type Props = React.PropsWithChildren<NextLinkProps> & {
	showActive?: boolean;
	dataId?: string;
	onClick?: React.MouseEventHandler;
};

const Link = ({ children, dataId, onClick, ...props }: Props) => {
	const router = useRouter();

	const { focusedId, setFocusedId } = useUiStore();

	// console.log(props.href);

	const showActive = props.showActive ?? true;
	const targetBlank =
		typeof props.href === "string" && (props.href.startsWith("//") || props.href.startsWith("/api"));
	const href = typeof props.href === "string" && props.href.split("?")[0];
	const asPath = router.asPath.split("?")[0];

	if (targetBlank && typeof props.href === "string") {
		return (
			<Styles href={props.href} data-id={dataId} rel="noreferrer noopener" target="_blank">
				{children}
			</Styles>
		);
	} else {
		return (
			<NextLink {...props} passHref scroll={false}>
				<Styles
					className={
						showActive &&
						((dataId === undefined &&
							asPath === href &&
							(focusedId === "" || asPath.endsWith(focusedId))) ||
							(!!dataId && focusedId === dataId))
							? "active"
							: ""
					}
					data-id={dataId}
					onClick={(ev) => {
						if (!router.asPath.startsWith("/schema")) {
							setFocusedId(dataId ?? "");
						}
						onClick?.(ev);
					}}
				>
					{children}
				</Styles>
			</NextLink>
		);
	}
};

export { Link };

const Styles = styled.a`
	display: inline-block;
	font-weight: 400;
`;
