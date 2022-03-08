import Head from "next/head";
import React, { useEffect, useState } from "react";
// import Image from "next/image";
import styled from "styled-components";

import { useOperatingSystem } from "Hooks";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

import { hasMinWidth } from "./GlobalStyles";

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

	const [os] = useOperatingSystem();

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
				className={`${os} ${navOpen ? "nav-open" : ""} ${animating ? "animating" : ""}`}
				onAnimationEnd={() => setAnimating(false)}
			>
				<Container>{!initialized ? "" : children}</Container>
			</Main>
			{/*<footer>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
				</a>
			</footer>*/}
		</>
	);
};

export { Page };

type NavBarProps = {
	navWidth: string;
};

const Main = styled.main<NavBarProps>`
	display: block;
	position: absolute;
	height: 100vh;
	top: 0;
	right: 0;
	bottom: auto;
	left: 0;
	transition: left 0.125s linear;
	overflow-y: auto;
	overflow-x: hidden;
	scrollbar-width: thin;
	scrollbar-color: ${getThemeVariable("secondaryColor")} transparent;

	background-color: ${getThemeVariable("background")};
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
				width: auto;
			}
		}
	}
	@media ${hasMinWidth(2)} {
		&.nav-open {
			overflow: auto;

			> div {
				width: auto;
			}
		}
	}
`;

const Container = styled.div`
	display: block;
	position: relative;
	max-width: 54rem;
	padding: 1rem;
	margin: 0 auto;
`;
