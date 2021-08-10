import { flatten } from "lodash";
import { GetStaticPropsContext } from "next";
import React from "react";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { withServerErrorPage } from "HighComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { getChaletTags } from "Server/ChaletTags";
import { getSchemaReferencePaths } from "Server/CustomMarkdownParser";
import { markdownFiles } from "Server/MarkdownFiles";

const MarkdownPage = withServerErrorPage((props: Props) => {
	return <MarkdownLayout {...props} />;
});

export const getStaticPaths = async () => {
	try {
		const tags = await getChaletTags();
		const schemaPaths: string[] = flatten(await Promise.all(tags.map((b) => getSchemaReferencePaths(b))));
		const paths = schemaPaths.map((p) => `/schema/${p}`);

		return {
			fallback: false,
			paths,
		};
	} catch (err) {
		console.error(err.message);
		throw err;
	}
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	if (
		!ctx ||
		!ctx.params ||
		!ctx.params.slug ||
		(typeof ctx.params.slug !== "string" && ctx.params.slug.length === 0)
	) {
		throw new Error("Params not found");
	}

	const { slug: slugRaw } = ctx.params;

	const slug: string = "schema";
	const query: Dictionary<string | undefined> = {
		branch: typeof slugRaw === "string" ? slugRaw : slugRaw[0],
	};

	if (typeof slugRaw !== "string") {
		if (slugRaw.length > 1) {
			query["definition"] = slugRaw[1];
		}
	}

	const page = await markdownFiles.getMdxPage(slug, query);
	return {
		props: {
			...page,
		},
	};
};

export default MarkdownPage;
