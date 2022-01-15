import { AppProps } from "next/app";
import Router from "next/router";
import React, { useEffect, useState } from "react";

import { Optional } from "@andrew-r-king/react-kitchen";
import ProgressBar from "@badrap/bar-of-progress";

import { BaseStyle } from "Components";
import { ThemeProvider } from "Components/ThemeProvider";
import { Providers, useUiStore } from "Stores";

type Props = AppProps;

const Main = ({ Component, pageProps }: Props) => {
	const [progress, setProgress] = useState<Optional<ProgressBar>>(null);
	const { theme } = useUiStore();

	useEffect(() => {
		if (!!progress) {
			Router.events.off("routeChangeStart", progress.start);
			Router.events.off("routeChangeComplete", progress.finish);
			Router.events.off("routeChangeError", progress.finish);
		}

		const prog = new ProgressBar({
			size: "0.25rem",
			color: theme.primaryColor,
			className: "router-progress-bar",
			delay: 100,
		});

		Router.events.on("routeChangeStart", prog.start);
		Router.events.on("routeChangeComplete", prog.finish);
		Router.events.on("routeChangeError", prog.finish);

		setProgress(prog);
	}, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Providers>
			<ThemeProvider />
			<BaseStyle />
			<Component {...pageProps} />
			{/* Modal */}
		</Providers>
	);
};

export default Main;
