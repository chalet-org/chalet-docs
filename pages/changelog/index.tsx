import React from "react";

import { docsApi } from "Api";
import { withServerErrorPage } from "HighComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { handleInitialProps } from "Utility";

const MarkdownPage = withServerErrorPage((props: Props) => {
	return <MarkdownLayout {...props} />;
});

MarkdownPage.getInitialProps = handleInitialProps(async (ctx) => {
	const page = await docsApi.getChangelogMdxPage();
	return {
		...page,
	};
});

export default MarkdownPage;
