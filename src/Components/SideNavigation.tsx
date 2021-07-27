import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React from "react";
import styled from "styled-components";

import { useKeyPress } from "Hooks";
import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";
import { dynamic } from "Utility";

const components: Record<string, React.ReactNode> = {
	// p: dynamic.component("Stub"),
	a: dynamic.component("Link"),
	ThemeToggle: dynamic.component("ThemeToggle"),
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
		border-right: 0.125rem solid ${getCssVariable("Border")};
	}

	> h4 {
		text-align: center;
	}

	ul,
	> p {
		display: flex;
		flex-direction: column;
		list-style-type: none;
		margin: 0;
		padding: 0;
		font-size: 1rem;
	}

	> p {
		padding-left: 1rem;
		font-weight: 600;
		line-height: 2.5;
	}

	> ul {
		padding-bottom: 2rem;
	}

	li {
		width: 100%;
	}

	a {
		display: block;
		padding-left: 0.5rem;
		line-height: 2.5;

		&:hover {
			text-decoration: underline;
			text-decoration-color: ${getCssVariable("Accent")};
		}

		&.active {
			background-color: ${getCssVariable("Background")};
			border-right: 0.25rem solid ${getCssVariable("Accent")};
		}
	}

	> ul > li > a {
		padding-left: 2rem;
	}

	> ul > li > ul > li > a {
		padding-left: 3.25rem;
	}

	a:not(.active) {
		color: inherit;
		font-weight: 400;
	}

	> ul > li > ul > li > a:before {
		&:hover {
			text-decoration: none;
		}
	}

	.theme-toggle {
		width: 100%;
		text-align: center;
	}
`;
