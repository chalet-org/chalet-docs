import React from "react";
import styled from "styled-components";

import { Link, SearchInput, ThemeToggle } from "Components";
import { useKeyPress } from "Hooks";
import { ResultNavigation } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";
import { makeLinearGradient } from "Utility";

import { NavigationLinks } from "./NavigationLinks";

type Props = ResultNavigation & {
	children?: React.ReactNode;
};

const SideNavigation = ({ children, ...navigationProps }: Props) => {
	const { toggleNavigation, navOpen, navWidth, initialized } = useUiStore();
	useKeyPress(
		(ev) => {
			if (ev.key === "Escape") {
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
				<SearchInput />
				<NavGroup>
					<NavigationLinks {...navigationProps} />
				</NavGroup>
				<div className="nav-spacer" />
				<div className="nav-fade">
					<ThemeToggle />
				</div>
			</StyledAside>
		</>
	);
};

export { SideNavigation };

const Logo = styled.h4`
	text-align: center;
	text-shadow: 0 0 0 transparent;
	transition: text-shadow 0.125s linear;
	text-transform: uppercase;
	letter-spacing: 0.625rem;
	word-spacing: 0.25rem;

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
	overflow-x: hidden;
	overflow-y: auto;

	background-color: ${getCssVariable("BackgroundCode")};
	color: ${getCssVariable("MainText")};

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
		font-weight: 600;
		line-height: 2;
		padding-bottom: 0.125rem;
	}

	li {
		width: 100%;

		strong {
			padding: 0;
			line-height: 2;
			padding-bottom: 0.125rem;
		}
	}

	a {
		display: block;
		line-height: 2;
		padding-bottom: 0.125rem;
		border-left: 0.25rem solid transparent;

		&:hover {
			text-decoration: underline;
			text-decoration-color: ${getCssVariable("Accent")};
		}

		&.active {
			background-color: ${getCssVariable("Background")};
			border-left-color: ${getCssVariable("Red")};
		}
	}

	a:not(.active) {
		color: inherit;
		font-weight: 400;
	}

	> div.nav-spacer {
		display: block;
		position: relative;
		width: 100%;
		padding: 4rem;
	}

	> div.nav-fade {
		display: block;
		position: fixed;
		width: calc(${(props) => props.width} - 0.125rem);
		height: 7.5rem;
		bottom: 0;

		${makeLinearGradient("transparent", getCssVariable("BackgroundCode"), 180)}
		background: ${getCssVariable("BackgroundCode")};
		background: linear-gradient(180deg, transparent 0%, ${getCssVariable("BackgroundCode")} 30%);

		> .theme-toggle {
			display: block;
			position: fixed;
			width: 2rem;
			height: 2rem;
			top: auto;
			bottom: 2.125rem;
			left: -4.125rem;
			right: auto;
			transition: left 0.125s linear;
		}
	}

	&.open {
		left: 0;
		border-right: 0.125rem solid ${getCssVariable("Border")};

		> div.nav-fade {
			> .theme-toggle {
				left: calc(${(props) => props.width} - 4.125rem);
			}
		}
	}
`;

const NavGroup = styled.div`
	padding-bottom: 1rem;

	> ul > li > a {
		padding-left: 1.75rem;
	}
	> ul > li > strong {
		padding-left: 2rem;
	}

	> ul > li > ul > li > a {
		padding-left: 2.5rem;
	}

	> ul > li > ul > li > ul > li > a {
		padding-left: 3rem;
	}

	> ul > li > strong {
		color: ${getCssVariable("Header")};
		font-weight: 400;
	}

	> ul > li > ul > li > a:before {
		&:hover {
			text-decoration: none;
		}
	}
`;
