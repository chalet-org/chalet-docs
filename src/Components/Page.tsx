import Head from "next/head";
import React, { useEffect } from "react";
// import Image from "next/image";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";

type Props = {
	children?: React.ReactNode;
	title: string;
};

const Page = ({ title, children }: Props) => {
	const { theme, initialize, initialized, navWidth, navOpen } = useUiStore();

	useEffect(() => {
		if (!initialized) {
			initialize();
		}
	}, [initialize, initialized]);

	useEffect(() => {
		document.body.style.backgroundColor = theme.bodyBackground;
	}, [theme]);

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta
					name="viewport"
					content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
				/>
			</Head>
			<Main {...{ navWidth }} className={navOpen ? "nav-open" : ""}>
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
	min-height: 100vh;
	top: 0;
	right: 0;
	bottom: auto;
	left: 0;
	transition: left 0.125s linear;

	background-color: ${getCssVariable("Background")};
	color: ${getCssVariable("MainText")};

	&.nav-open {
		left: ${(props) => props.navWidth};
	}
`;

const Container = styled.div`
	display: block;
	position: relative;
	max-width: 54rem;
	padding: 1rem;
	margin: 0 auto;
`;
