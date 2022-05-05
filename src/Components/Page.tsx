import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
// import Image from "next/image";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

import { Container } from "./Container";
import { hasMinWidth } from "./GlobalStyles";
import { PageFooter } from "./PageFooter";

type Props = React.PropsWithChildren<{
	title: string;
}>;

const Page = ({ title, children }: Props) => {
	const { initialize, initialized, navWidth, navOpen, animating, setAnimating } = useUiStore();

	useEffect(() => {
		if (!initialized) {
			initialize();
		}
	}, [initialize, initialized]);

	const pageTitle = `Chalet :: ${title}`;

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta
					name="viewport"
					content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
				/>
				<meta property="og:title" content={pageTitle} />
				<meta name="twitter:title" content={pageTitle} />
			</Head>
			<Main
				id="main"
				{...{ navWidth }}
				className={`${navOpen ? "nav-open" : ""} ${animating ? "animating" : ""}`}
				onAnimationEnd={() => setAnimating(false)}
			>
				{initialized ? (
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
	overflow-y: scroll;
	overflow-x: hidden;
	scrollbar-width: thin;
	scrollbar-color: ${getThemeVariable("primaryColor")} transparent;

	background-color: ${getThemeVariable("background")};
	background: ${getThemeVariable("mainBackgroundUrl")};
	/* background by SVGBackgrounds.com */
	background-size: cover;
	background-position: 100% center;
	background-repeat: no-repeat;
	color: ${getThemeVariable("primaryText")};

	&::-webkit-scrollbar-thumb {
		background-color: ${getThemeVariable("primaryColor")};

		&:hover {
			background-color: ${getThemeVariable("secondaryColor")};
		}
	}

	&.nav-open {
		left: ${(props) => props.navWidth};
		overflow-y: hidden;

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
			overflow-y: scroll;

			> div {
				width: 100%;
			}
		}
	}
	@media ${hasMinWidth(2)} {
		&.nav-open {
			overflow-y: scroll;

			> div {
				width: 100%;
			}
		}
	}
`;

const Spacer = styled.div`
	flex: 1 0 auto;
`;
