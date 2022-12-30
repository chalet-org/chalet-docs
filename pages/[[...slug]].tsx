import { GetStaticPropsContext } from "next";
import path from "path";
import React from "react";

import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { markdownFiles } from "Server/MarkdownFiles";
import { recursiveDirectorySearch } from "Server/RecursiveDirectorySearch";
import { withServerErrorHandler } from "Utility";

const MarkdownPage = (props: Props) => {
	return <MarkdownLayout {...props} />;
};

export default MarkdownPage;

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
			} else if (result.endsWith("/download")) {
				return acc;
			}

			acc.push(result);
			return acc;
		}, []);

		return {
			fallback: false,
			paths,
		};
	} catch (err: any) {
		console.error(err?.message);
		throw err;
	}
};

export const getStaticProps = withServerErrorHandler(
	async (
		ctx: GetStaticPropsContext<{
			slug?: string | string[];
		}>
	) => {
		if (!ctx || !ctx.params) {
			throw new Error("Params not found");
		}

		const { slug: slugRaw } = ctx.params;
		const slug: string = path.join(typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");

		const page = await markdownFiles.getMdxPage(slug, {});
		return {
			props: {
				...page,
			},
		};
	}
);
