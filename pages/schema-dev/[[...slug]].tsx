import React from "react";

import { docsApi } from "Api";
import { withServerErrorPage } from "HighComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { SchemaType } from "Server/ResultTypes";
import { handleInitialProps } from "Utility";

const MarkdownPage = withServerErrorPage((props: Props) => {
	return <MarkdownLayout {...props} isSchema />;
});

MarkdownPage.getInitialProps = handleInitialProps(async (ctx) => {
	if (!ctx.query.slug || (typeof ctx.query.slug !== "string" && ctx.query.slug.length === 0)) {
		throw new Error("Params not found");
	}

	const { slug } = ctx.query;
	if (
		ctx.query.slug.length < 2 ||
		(typeof slug !== "string" && slug[1] !== SchemaType.SettingsJson && slug[1] !== SchemaType.ChaletJson)
	) {
		throw new Error(`Invalid slug rquested: ${ctx.query.slug}`);
	}

	const branch: string = typeof slug === "string" ? slug : slug[0];

	let definition: string = "";
	const schemaType = slug[1] as SchemaType;

	if (typeof slug !== "string") {
		if (slug.length > 2) {
			definition = slug[2];
		}
	}

	const page = await docsApi.getSchemaDevMdxPage(definition, branch, schemaType);
	return {
		...page,
	};
});

export default MarkdownPage;
