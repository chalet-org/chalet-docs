import { default as NextLink, LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";

type Props = React.PropsWithChildren<NextLinkProps> & {
	showActive?: boolean;
	trackHeadings?: boolean;
	dataId?: string;
	title?: string;
	onClick?: React.MouseEventHandler;
};

const Link = ({ children, dataId, onClick, title, ...props }: Props) => {
	const router = useRouter();

	const { focusedId } = useUiStore();

	/*if (typeof props.href === "string" && props.href.startsWith("https")) {
		console.log(props.href);
		throw new Error("Error: Link expects href without 'https:'. Use '//' instead.");
	}*/
	const showActive = props.showActive ?? true;
	const trackHeadings = props.trackHeadings ?? false;
	const targetBlank =
		typeof props.href === "string" && (props.href.startsWith("//") || props.href.startsWith("/api"));
	const href = typeof props.href === "string" ? props.href.split("?")[0] : null;
	const asPath = router.asPath.split("?")[0];

	if (targetBlank && typeof props.href === "string") {
		return (
			<Styles
				href={props.href}
				data-id={dataId}
				title={title}
				onClick={onClick}
				rel="noreferrer noopener"
				target="_blank"
			>
				{children}
			</Styles>
		);
	} else {
		const usesDataId =
			!!dataId &&
			(focusedId === dataId || (dataId !== "/" && dataId.startsWith("/") && focusedId.startsWith(dataId)));
		const startsWith = !!href && !trackHeadings && href !== "/" && asPath.startsWith(href);
		const active = showActive && (usesDataId || startsWith);

		return (
			<NextLink {...props} passHref scroll={false}>
				<Styles
					className={active ? "active" : ""}
					data-id={dataId}
					onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
					onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
					title={title}
					onClick={onClick}
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
