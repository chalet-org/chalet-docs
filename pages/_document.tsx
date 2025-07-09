import Document, { Html, Head, Main, NextScript, DocumentProps } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

import { rootStyles } from "Components";

type Props = DocumentProps & {};

class MyDocument extends Document<Props> {
	static path: string = "";

	// Note: this gets rid of the "flicker" during first paint
	static async getInitialProps(ctx: any) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		MyDocument.path = ctx.asPath;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		let path = MyDocument.path;
		if (path.length > 0) path += "/";

		const domain: string = "chalet-work.space";
		const url: string = `https://www.${domain}${path}`;
		const description: string =
			"A cross-platform project format & build tool for C/C++ focused on usability and interoperability.";
		const image: string = `https://www.${domain}/images/chalet-banner.jpg`;

		return (
			<Html>
				<Head>
					<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
					<meta name="description" content={description} />

					{/* Facebook Meta Tags */}
					<meta property="og:url" content={url} />
					<meta property="og:type" content="website" />
					<meta property="og:description" content={description} />
					<meta property="og:image" content={image} />

					{/* Twitter Meta Tags */}
					<meta name="twitter:card" content="summary_large_image" />
					<meta property="twitter:domain" content={domain} />
					<meta property="twitter:url" content={url} />
					<meta name="twitter:description" content={description} />
					<meta name="twitter:image" content={image} />

					{/* Mastodon Meta Tags */}
					<link rel="me" href="https://mastodon.gamedev.place/@rewrking" />
					<meta name="fediverse:creator" content="@rewrking@mastodon.gamedev.place" />

					<link rel="icon" href="/favicon.ico" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
					<link
						href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@300;400;600;700&family=Poppins:wght@400;500&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap"
						rel="stylesheet"
					/>
					<meta name="color-scheme" content="dark light" />
					<style>{rootStyles}</style>
					<script type="text/javascript" src="/js/theme-startup.js" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
