import Head from "next/head";
import React, { useEffect } from "react";
// import Image from "next/image";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { PageThemeType } from "Theme";

type Props = {
	children?: React.ReactNode;
	title: string;
};

const Page = ({ title, children }: Props) => {
	const { theme, initialize, initialized } = useUiStore();

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
			<Main {...(!initialized ? null : { ...theme })}>{!initialized ? "" : children}</Main>
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

const Main = styled.main<Partial<PageThemeType>>`
	display: block;
	position: relative;
	width: 100%;
	min-height: calc(100vh - 2rem);
	transition: background-color 0.125s linear;

	padding: 1rem;
	background-color: ${(theme) => theme.background ?? "#757575"};
	color: ${(theme) => theme.mainText ?? "#232323"};
`;
