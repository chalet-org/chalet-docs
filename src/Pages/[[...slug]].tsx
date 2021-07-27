import path from "path";
import React from "react";

import { docsApi } from "Api";
import { withServerErrorPage } from "HighComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { handleInitialProps } from "Utility";

const MarkdownPage = withServerErrorPage((props: Props) => {
	return <MarkdownLayout {...props} />;
});

MarkdownPage.getInitialProps = handleInitialProps(async (ctx) => {
	const { slug: slugRaw } = ctx.query;
	const slug: string = path.join(typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");
	const page = await docsApi.getMdx(slug);
	return {
		...page,
	};
});

export default MarkdownPage;
