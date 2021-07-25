import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { MDXResult } from "Api";
import { useKeyPress } from "Hooks";
import { useUiStore } from "Stores";
import { PageThemeType } from "Theme";
import { dynamic } from "Utility";

const components: Record<string, React.ReactNode> = {
	p: dynamic.component("Stub"),
	a: dynamic.component("Link"),
};

export type NavProps = {
	mdxNav: MDXRemoteSerializeResult<Record<string, unknown>>;
};

type Props = NavProps & {
	children?: React.ReactNode;
};

const SideNavigation = ({ mdxNav }: Props) => {
	const { toggleNavigation, navOpen, navWidth, initialized, theme } = useUiStore();
	useKeyPress(
		(ev) => {
			if (ev.key === "27") {
				ev.preventDefault();
				toggleNavigation();
			}
		},
		[toggleNavigation]
	);

	if (!initialized) {
		return null;
	}
	return (
		<>
			<SidebarToggle
				onClick={(ev) => {
					ev.preventDefault();
					toggleNavigation();
				}}
			>
				Toggle
			</SidebarToggle>
			<StyledAside className={`sidebar ${navOpen ? "open" : ""}`} width={navWidth} {...theme}>
				<MDXRemote {...mdxNav} components={components} />
			</StyledAside>
		</>
	);
};

export { SideNavigation };

const SidebarToggle = styled.button`
	display: block;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
`;

type AsideProps = {
	width: string;
};

const StyledAside = styled.aside<Partial<PageThemeType> & AsideProps>`
	display: flex;
	flex-direction: column;
	position: fixed;
	bottom: 0;
	top: 0;
	left: -${(props) => props.width};
	width: ${(props) => props.width};
	transition: left 0.125s linear;
	z-index: 90;
	overflow: hidden;

	background-color: ${(theme) => theme.bodyBackground ?? "#000000"};
	color: ${(theme) => theme.mainText ?? "#232323"};

	&.open {
		left: 0;
	}
`;
