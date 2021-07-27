import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React from "react";
import styled from "styled-components";

import { Link, ThemeToggle } from "Components";
import { useKeyPress } from "Hooks";
import { ResultMDXNav } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";
import { dynamic } from "Utility";

const components: Record<string, React.ReactNode> = {
	// p: dynamic.component("Stub"),
	a: dynamic.component("Link"),
	ThemeToggle: dynamic.component("ThemeToggle"),
};

type Props = ResultMDXNav & {
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
				<span />
				<span />
				<span />
			</SidebarToggle>
			<StyledAside className={`sidebar ${navOpen ? "open" : ""}`} width={navWidth}>
				<Logo>
					<Link href="/" showActive={false}>
						Chalet
					</Link>
				</Logo>
				<MDXRemote {...mdxNav} components={components} />
				<ThemeToggle />
			</StyledAside>
		</>
	);
};

export { SideNavigation };

const Logo = styled.h4`
	text-align: center;
	text-shadow: 0 0 0 transparent;
	transition: text-shadow 0.125s linear;

	> a {
		text-decoration: none !important;
	}

	&:hover {
		text-shadow: 0 0.125rem 0.5rem ${getCssVariable("Accent")};
	}
`;

const SidebarToggle = styled.button`
	display: block;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
	padding: 1rem;
	margin: 1rem;
	cursor: pointer;
	background: none;

	> span {
		background-color: ${getCssVariable("Accent")};
		display: block;
		margin-bottom: 0.5rem;
		width: 2rem;
		height: 0.125rem;
	}
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
		display: block;
		position: absolute;
		width: 2rem;
		height: 2rem;
		top: auto;
		bottom: 2.125rem;
		left: auto;
		right: 2.125rem;
	}
`;
