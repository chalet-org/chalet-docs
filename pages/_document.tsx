import Document, { Html, Head, Main, NextScript, DocumentProps } from "next/document";
import React from "react";

import { rootStyles } from "Components";

type Props = DocumentProps & {};

class MyDocument extends Document<Props> {
	render() {
		const { slug: slugRaw } = this.props.__NEXT_DATA__.query;
		let slug: string = typeof slugRaw === "string" ? slugRaw : slugRaw?.join("/") ?? "";
		if (slug.length > 0) slug += "/";

		const domain: string = "chalet-work.space";
		const url: string = `https://www.${domain}/${slug}`;
		const description: string =
			"A modern, cross-platform project format and build system for C/C++ focused on readability and interoperability.";
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
