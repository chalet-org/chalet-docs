import React from "react";
import { AppProps } from "next/app";

import { Providers } from "Stores";
import { BaseStyle } from "Components";

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
