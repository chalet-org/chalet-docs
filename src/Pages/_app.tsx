import { AppProps } from "next/app";
import React from "react";

import { BaseStyle } from "Components";
import { Providers } from "Stores";

const Main = ({ Component, pageProps }: AppProps) => {
	return (
		<Providers>
			<BaseStyle />
			<Component {...pageProps} />
			{/* Modal */}
		</Providers>
	);
};

export default Main;
