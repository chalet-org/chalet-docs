import { GetStaticPropsContext } from "next";
import { MDXRemote } from "next-mdx-remote";
import path from "path";
import React from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { Page } from "Components";
import { markdownFiles, MDXResult } from "Server/MarkdownFiles";
import { dynamic, recursiveDirectorySearch } from "Utility";

type Props = MDXResult & {
	children?: React.ReactNode;
};

const components: Dictionary<React.ComponentType<any>> = {
	a: dynamic.component("Link"),
	pre: dynamic.component("CodePreFromMarkdown"),
	inlineCode: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
	ThemeToggle: dynamic.component("ThemeToggle"),
};

const MarkdownPage = ({ meta, mdx, children }: Props) => {
	return (
		<Page title={meta.title}>
			<Styles>
				<MDXRemote {...mdx} components={components} />
			</Styles>
		</Page>
	);
};

export default MarkdownPage;

const mdpages = "mdpages";

export async function getStaticPaths() {
	try {
		const pathsRaw = await recursiveDirectorySearch(`${mdpages}/docs`, ["md", "mdx"]);
		const paths = pathsRaw.map((inPath: string): string => {
			let result: string = inPath.substring(0, inPath.lastIndexOf("."));
			result = result.slice(mdpages.length + 1);
			if (result.endsWith("/index")) {
				return result.slice(0, -6);
			}
			return result;
		});
		// console.log(paths);

		return {
			fallback: false,
			paths,
		};
	} catch (err) {
		console.error(err.message);
		throw err;
	}
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	if (!ctx || !ctx.params) {
		throw new Error("Params not found");
	}

	const navProps = await markdownFiles.getNavBar();

	const { slug: slugRaw } = ctx.params;
	const slug: string = path.join("docs", typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");
	const { meta, mdx } = await markdownFiles.getMdx(slug);
	return {
		props: {
			...navProps,
			meta,
			mdx,
		},
	};
};

const Styles = styled.div`
	display: block;
`;
