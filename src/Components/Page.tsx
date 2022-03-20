import Head from "next/head";
import React, { useEffect, useState } from "react";
// import Image from "next/image";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

import { Container } from "./Container";
import { hasMinWidth } from "./GlobalStyles";
import { PageFooter } from "./PageFooter";

type Props = {
	children?: React.ReactNode;
	title: string;
};

const Page = ({ title, children }: Props) => {
	const { theme, initialize, initialized, navWidth, navOpen } = useUiStore();

	const [animating, setAnimating] = useState<boolean>(false);

	useEffect(() => {
		if (!initialized) {
			initialize();
		}
	}, [initialize, initialized]);

	useEffect(() => {
		document.body.style.backgroundColor = theme.background;
	}, [theme]);

	useEffect(() => {
		setAnimating(true);
	}, [navOpen]);

	return (
		<>
			<Head>
				<title>{title} :: Chalet</title>
				<meta
					name="viewport"
					content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
				/>
			</Head>
			<Main
				id="main"
				{...{ navWidth }}
				className={`${navOpen ? "nav-open" : ""} ${animating ? "animating" : ""}`}
				onAnimationEnd={() => setAnimating(false)}
			>
				{!!initialized ? (
					<>
						<Container>{children}</Container>
						<Spacer />
						<PageFooter />
					</>
				) : (
					""
				)}
			</Main>
		</>
	);
};

export { Page };

type NavBarProps = {
	navWidth: string;
};

const Main = styled.main<NavBarProps>`
	display: flex;
	position: absolute;
	flex-direction: column;
	height: 100vh;
	top: 0;
	right: 0;
	bottom: auto;
	left: 0;
	transition: left 0.125s linear;
	overflow-y: auto;
	overflow-x: hidden;
	scrollbar-width: thin;
	scrollbar-color: ${getThemeVariable("primaryColor")} transparent;

	background-color: ${getThemeVariable("background")};
	background: ${getThemeVariable("mainBackgroundUrl")};
	/* background by SVGBackgrounds.com */
	background-size: cover;
	background-position: 100% center;
	background-repeat: no-repeat;
	color: ${getThemeVariable("mainText")};

	&::-webkit-scrollbar-thumb {
		background-color: ${getThemeVariable("primaryColor")};

		&:hover {
			background-color: ${getThemeVariable("secondaryColor")};
		}
	}

	&.nav-open {
		left: ${(props) => props.navWidth};
		overflow: hidden;

		> div {
			width: 100vw;
		}
	}

	&.animating {
		> div {
			width: 100vw;
		}
	}

	&:focus-visible {
		position: absolute;
	}

	@media ${hasMinWidth(0)} {
		/**/
	}
	@media ${hasMinWidth(1)} {
		&.nav-open {
			overflow: auto;

			> div {
				width: 100%;
			}
		}
	}
	@media ${hasMinWidth(2)} {
		&.nav-open {
			overflow: auto;

			> div {
				width: 100%;
			}
		}
	}
`;

const Spacer = styled.div`
	flex: 1 0 auto;
`;
