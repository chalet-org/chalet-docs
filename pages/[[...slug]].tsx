import { GetStaticPropsContext } from "next";
import path from "path";
import React from "react";

import { withServerErrorPage } from "HighComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { markdownFiles } from "Server/MarkdownFiles";
import { recursiveDirectorySearch } from "Server/RecursiveDirectorySearch";

const MarkdownPage = withServerErrorPage((props: Props) => {
	return <MarkdownLayout {...props} />;
});

const mdpages = "mdpages";

export const getStaticPaths = async () => {
	try {
		const pathsRaw = await recursiveDirectorySearch(mdpages, ["md", "mdx"]);
		const paths = pathsRaw.reduce<string[]>((acc, inPath, i, arr) => {
			let result: string = inPath.substring(0, inPath.lastIndexOf("."));
			result = result.slice(mdpages.length + 1);
			if (result.endsWith("/index")) {
				result = result.slice(0, -6);

				if (result.length === 0) result = "/";
			}

			acc.push(result);
			return acc;
		}, []);
		// console.log(paths);

		return {
			fallback: false,
			paths,
		};
	} catch (err) {
		console.error(err.message);
		throw err;
	}
};

export const getStaticProps = async (
	ctx: GetStaticPropsContext<{
		slug?: string | string[];
	}>
) => {
	if (!ctx || !ctx.params) {
		throw new Error("Params not found");
	}

	// console.log(ctx.params);

	// const { slug: slugRaw } = ctx.params;
	const { slug: slugRaw } = ctx.params;

	const slug: string = path.join(typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");

	const page = await markdownFiles.getMdxPage(slug, {});
	return {
		props: {
			...page,
		},
	};
};

export default MarkdownPage;
