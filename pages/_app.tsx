import { AppProps } from "next/app";
import Router from "next/router";
import React, { useEffect, useState } from "react";

import { Optional } from "@andrew-r-king/react-kitchen";
import ProgressBar from "@badrap/bar-of-progress";

import { BaseStyle } from "Components";
import { ThemeProvider } from "Components/ThemeProvider";
import { Providers, useUiStore } from "Stores";

let progress: Optional<ProgressBar> = null;
if (progress === null) {
	progress = new ProgressBar({
		size: "0.25rem",
		color: "black",
		className: "router-progress-bar",
		delay: 100,
	});

	Router.events.on("routeChangeStart", progress.start);
	Router.events.on("routeChangeComplete", progress.finish);
	Router.events.on("routeChangeError", progress.finish);
}

type Props = AppProps;

const Main = ({ Component, pageProps }: Props) => {
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
