import React from "react";

import { docsApi } from "Api";
import { withServerErrorPage } from "HighComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { handleInitialProps } from "Utility";

const MarkdownPage = withServerErrorPage((props: Props) => {
	return <MarkdownLayout {...props} isSchema />;
});

MarkdownPage.getInitialProps = handleInitialProps(async (ctx) => {
	if (!ctx.query.slug || (typeof ctx.query.slug !== "string" && ctx.query.slug.length === 0)) {
		throw new Error("Params not found");
	}

	const { slug } = ctx.query;
	const branch: string = typeof slug === "string" ? slug : slug[0];

	let definition: string = "";

	if (typeof slug !== "string") {
		if (slug.length > 1) {
			definition = slug[1];
		}
	}

	const page = await docsApi.getMdxPage("schema-dev", definition, branch);
	return {
		...page,
	};
});

export default MarkdownPage;
