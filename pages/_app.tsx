import { AppProps } from "next/app";
// import Router from "next/router";
import React from "react";

// import ProgressBar from "@badrap/bar-of-progress";
// import { Optional } from "Utility";
import { BaseStyle } from "Components";
import { Providers } from "Stores";
import { usePanelbear } from "Utility";

/*let progress: Optional<ProgressBar> = null;
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
}*/

type Props = AppProps & {
	Component: any;
};

const Main = ({ Component, pageProps }: Props) => {
	usePanelbear();

	return (
		<Providers>
			<BaseStyle />
			<Component {...pageProps} />
			{/* Modal */}
		</Providers>
	);
};

export default Main;
