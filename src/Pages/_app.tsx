import { AppProps } from "next/app";
import Router from "next/router";
import React, { useEffect, useState } from "react";

import { Optional } from "@andrew-r-king/react-kitchen";
import ProgressBar from "@badrap/bar-of-progress";

import { BaseStyle } from "Components";
import { Providers, useUiStore } from "Stores";

const Main = ({ Component, pageProps }: AppProps) => {
	const [progress, setProgress] = useState<Optional<ProgressBar>>(null);
	const { codeTheme } = useUiStore();

	useEffect(() => {
		setProgress(
			new ProgressBar({
				size: "0.25rem",
				color: codeTheme.accent,
				className: "router-progress-bar",
				delay: 100,
			})
		);
	}, [codeTheme]);

	useEffect(() => {
		if (!!progress) {
			Router.events.on("routeChangeStart", progress.start);
			Router.events.on("routeChangeComplete", progress.finish);
			Router.events.on("routeChangeError", progress.finish);
		}
	}, [progress]);

	return (
		<Providers>
			<BaseStyle />
			<Component {...pageProps} />
			{/* Modal */}
		</Providers>
	);
};

export default Main;
