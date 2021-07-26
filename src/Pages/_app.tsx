import { AppProps } from "next/app";
import Router from "next/router";
import React, { useEffect, useState } from "react";

import { Optional } from "@andrew-r-king/react-kitchen";
import ProgressBar from "@badrap/bar-of-progress";

import { BaseStyle, SideNavigation } from "Components";
import { Providers, useUiStore } from "Stores";

type Props = AppProps;

const Main = ({ Component, pageProps: { mdxNav, ...pageProps } }: Props) => {
	const [progress, setProgress] = useState<Optional<ProgressBar>>(null);
	const { codeTheme } = useUiStore();

	useEffect(() => {
		if (!!progress) {
			Router.events.off("routeChangeStart", progress.start);
			Router.events.off("routeChangeComplete", progress.finish);
			Router.events.off("routeChangeError", progress.finish);
		}

		const prog = new ProgressBar({
			size: "0.25rem",
			color: codeTheme.accent,
			className: "router-progress-bar",
			delay: 100,
		});

		Router.events.on("routeChangeStart", prog.start);
		Router.events.on("routeChangeComplete", prog.finish);
		Router.events.on("routeChangeError", prog.finish);

		setProgress(prog);
	}, [codeTheme]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Providers>
			<BaseStyle />
			{mdxNav && <SideNavigation mdxNav={mdxNav} />}
			<Component {...pageProps} />
			{/* Modal */}
		</Providers>
	);
};

export default Main;
