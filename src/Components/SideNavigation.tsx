import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React from "react";
import styled from "styled-components";

import { useKeyPress } from "Hooks";
import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";
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
	const { toggleNavigation, navOpen, navWidth, initialized } = useUiStore();
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
			<StyledAside className={`sidebar ${navOpen ? "open" : ""}`} width={navWidth}>
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

const StyledAside = styled.aside<AsideProps>`
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

	background-color: ${getCssVariable("BackgroundCode")};
	color: ${getCssVariable("MainText")};

	&.open {
		left: 0;
	}

	> h4 {
		text-align: center;
	}
`;
