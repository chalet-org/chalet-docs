import clsx from "clsx";
import React, { useCallback } from "react";
import styled from "styled-components";

import { Link, SearchInput, ThemeToggle, hasMaxWidth } from "Components";
import { useKeyPress } from "Hooks";
import { ResultNavigation } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

import { NavigationLinks } from "./NavigationLinks";
import { makeLinearGradient } from "Utility/CssGradient";

type Props = React.PropsWithChildren<ResultNavigation & {}>;

const SideNavigation = ({ children, ...navProps }: Props) => {
	const { toggleNavigation, navOpen, setNavOpen, navWidth, initialized } = useUiStore();
	useKeyPress(
		(ev) => {
			if (ev.key === "Escape") {
				ev.preventDefault();
				toggleNavigation();
			}
		},
		[toggleNavigation]
	);
	const onClick = useCallback(() => {
		const tooLarge = window.matchMedia?.("(min-width: 960px)").matches ?? true;
		if (!tooLarge) setNavOpen(false);
	}, []);

	if (!initialized) {
		return null;
	}
	return (
		<>
			<SidebarToggle
				className={clsx({
					sidebar: true,
					open: navOpen,
				})}
				onTouchStart={(ev) => (ev.target as HTMLButtonElement).classList.add("touch-hover")}
				onTouchEnd={(ev) => (ev.target as HTMLButtonElement).classList.remove("touch-hover")}
				onClick={(ev) => {
					ev.preventDefault();
					toggleNavigation();
				}}
				title="Menu toggle"
			>
				<span />
				<span />
				<span />
			</SidebarToggle>
			<StyledAside className={`sidebar ${navOpen ? "open" : ""}`} width={navWidth}>
				<Logo>
					<Link href="/" showActive={false} onClick={onClick}>
						<img src="/images/chalet-logo.svg" alt="Chalet logo" />
					</Link>
					<h4>
						<Link href="/" showActive={false} onClick={onClick}>
							Chalet
						</Link>
					</h4>
				</Logo>
				<LogoContainer />
				<SearchInput />
				<NavGroup>
					<NavigationLinks {...navProps} />
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

const LogoContainer = styled.div`
	display: block;
	position: relative;
	width: 100%;
	min-height: 5.8rem;
`;

const Logo = styled.div`
	display: flex;
	position: absolute;
	flex-direction: column;
	justify-content: center;
	z-index: 99;
	left: 50%;
	transform: translateX(-50%);

	> h4 {
		line-height: 1;
		padding: 0;
		align-self: center;
		text-transform: uppercase;
		letter-spacing: 0.325em;
		margin-left: 0.175em;
		text-align: center;
		text-shadow: 0 0 0 transparent;
		transition: text-shadow 0.125s linear;

		> a {
			text-decoration: none !important;
			color: ${getThemeVariable("primaryText")};

			&:active {
				background-color: transparent !important;
			}
		}
	}

	> a {
		display: block;
		align-self: center;

		> img {
			width: 3.5rem;
			height: auto;
		}

		&:active {
			background: transparent !important;
		}
	}

	&:hover {
		> h4 {
			text-shadow: 0 0.125rem 0.5rem ${getThemeVariable("primaryColor")};
		}
	}
`;

const SidebarToggle = styled.button`
	display: block;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99;
	padding: 0.25rem;
	margin: 1.75rem;
	cursor: pointer;
	background: transparent;
	border-radius: 0.25rem;

	> span {
		background-color: ${getThemeVariable("header")};
		transition: background-color 0.125s linear;
		display: block;
		margin-bottom: 0.5rem;
		width: 2rem;
		height: 0.125rem;

		&:last-of-type {
			margin-bottom: 0;
		}
	}

	&:hover,
	&.touch-hover {
		> span {
			background-color: ${getThemeVariable("primaryColor")};
		}
	}

	&:focus-visible {
		position: fixed;
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
	overflow-y: scroll;
	padding-top: 5.5rem;

	background-color: ${getThemeVariable("codeBackground")};
	color: ${getThemeVariable("primaryText")};

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
			line-height: 1.667;
			padding-bottom: 0.125rem;
		}
	}

	a {
		display: block;
		line-height: 1.667;
		padding-bottom: 0.125rem;
		border-left: 0.25rem solid transparent;
		text-decoration: underline;
		text-decoration-color: transparent;
		transition: text-decoration-color 0.125s linear;

		&:hover {
			text-decoration-color: ${getThemeVariable("primaryColor")};
		}

		&:active {
			background-color: ${getThemeVariable("background")};
		}

		&.active {
			background-color: ${getThemeVariable("background")};
			border-left-color: ${getThemeVariable("tertiaryColor")};
		}
	}

	a:not(.active) {
		font-weight: 400;
	}

	> div.nav-spacer {
		display: block;
		position: relative;
		width: 100%;
		padding: 2rem;
	}

	> div.nav-fade {
		display: block;
		position: fixed;
		width: ${(props) => props.width};
		height: 7.5rem;
		top: 0;
		bottom: auto;

		${makeLinearGradient("transparent", getThemeVariable("codeBackground"), 180)}
		background: ${getThemeVariable("codeBackground")};
		background: linear-gradient(
			180deg,
			${getThemeVariable("fadeBackgroundB")} 45%,
			${getThemeVariable("fadeBackgroundA")} 100%
		);

		> .theme-toggle {
			display: block;
			position: fixed;
			width: 2rem;
			height: 2rem;
			top: 1.75rem;
			bottom: auto;
			left: -4.125rem;
			right: auto;
			transition: left 0.125s linear;
		}
	}

	&.open {
		left: 0;
		/* border-right: 0.125rem solid ${getThemeVariable("border")}; */

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
		color: inherit;
		padding-left: 1.75rem;
	}
	> ul > li > strong {
		padding-left: 2rem;
	}

	> ul > li > ul > li > a {
		padding-left: 2.75rem;
		color: inherit;
		position: relative;

		&:before {
			content: " ";
			display: block;
			position: absolute;
			left: 1.875rem;
			top: 50%;
			transform: translateY(-50%);
			width: 0.125rem;
			height: 1rem;
			background-color: ${getThemeVariable("header")};
		}
	}

	> ul > li > ul > li > ul > li > a {
		padding-left: 3.5rem;
	}

	> ul > li > strong {
		color: ${getThemeVariable("header")};
		font-weight: 400;
	}

	> ul > li > ul > li > a:before {
		&:hover {
			text-decoration: none;
		}
	}

	a.active {
		color: ${getThemeVariable("secondaryColor")};

		&:hover {
			color: ${getThemeVariable("primaryColor")};
		}
	}

	a:not(.active):hover {
		color: ${getThemeVariable("primaryText")};
	}

	@media ${hasMaxWidth(0)} {
		a {
			font-size: 1.33rem;
			line-height: 2;
		}
		> ul > li > a {
			padding-left: 1.75rem;
		}
		> ul > li > strong {
			padding-left: 2rem;
		}

		> ul > li > ul > li > a {
			padding-left: 2.75rem;

			&:before {
				content: " ";
				display: block;
				position: absolute;
				left: 1.875rem;
				top: 50%;
				transform: translateY(-50%);
				width: 0.25rem;
				height: 1.5rem;
			}
		}

		> ul > li > ul > li > ul > li > a {
			padding-left: 3.5rem;
		}
	}
`;
