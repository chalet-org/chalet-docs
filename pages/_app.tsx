import { AppProps } from "next/app";
// import Router from "next/router";
import React from "react";

// import ProgressBar from "@badrap/bar-of-progress";
// import { Optional } from "@rewrking/react-kitchen";
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

const PANELBEAR_ID: string = process.env.NEXT_PUBLIC_PANELBEAR_ID ?? "";

type Props = AppProps;

const Main = ({ Component, pageProps }: Props) => {
	usePanelbear(PANELBEAR_ID);

	return (
		<Providers>
			<BaseStyle />
			<Component {...pageProps} />
			{/* Modal */}
		</Providers>
	);
};

export default Main;
