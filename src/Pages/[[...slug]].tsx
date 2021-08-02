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
	const { slug: slugRaw, definition: definitionRaw, branch: branchRaw } = ctx.query;

	const slug: string = path.join(typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");
	const definition: string = typeof definitionRaw === "string" ? definitionRaw : definitionRaw?.join("") ?? "";
	const branch: string = typeof branchRaw === "string" ? branchRaw : branchRaw?.join("") ?? "development";

	const page = await docsApi.getMdx(slug, definition, branch);
	return {
		...page,
	};
});

export default MarkdownPage;
