import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import path from "path";
import React, { useEffect } from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { docsApi } from "Api";
import { Page, AnchoredHeading, Heading, SchemaTest } from "Components";
import { useRouterScroll } from "Hooks";
import { ResultMDXPage } from "Server/ResultTypes";
import { dynamic, handleInitialProps, ServerProps } from "Utility";

type Props = ServerProps<
	Omit<
		ResultMDXPage & {
			children?: React.ReactNode;
		},
		"mdxNav"
	>
>;

let components: Dictionary<React.ComponentType<any>> = {
	...AnchoredHeading,
	h1: Heading.h1,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	inlineCode: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
};

const MarkdownPage = ({ meta, mdx, error, children, schema }: Props) => {
	const router = useRouter();

	if (!!schema) {
		components["SchemaTest"] = () => <SchemaTest {...{ schema }} />;
	}

	useEffect(() => {
		if (!!error) {
			router.replace("/404", router.asPath, {
				shallow: true,
			});
		}
	}, [error]);

	useRouterScroll();

	if (!!error) return null;

	return (
		<Page title={meta.title}>
			<Styles>
				<MDXRemote {...mdx} components={components} />
			</Styles>
		</Page>
	);
};

MarkdownPage.getInitialProps = handleInitialProps(async (ctx) => {
	try {
		const { slug: slugRaw } = ctx.query;
		const slug: string = path.join(typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");
		const { meta, mdx, mdxNav, schema } = await docsApi.getMdx(slug);
		return {
			mdxNav,
			meta,
			mdx,
			schema,
		};
	} catch (err) {
		throw err;
	}
});

export default MarkdownPage;

// const mdpages = "mdpages";

/*export const getStaticPaths = async () => {
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
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	if (!ctx || !ctx.params) {
		throw new Error("Params not found");
	}

	const { slug: slugRaw } = ctx.params;
	const slug: string = path.join("docs", typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");
	const { meta, mdx, mdxNav } = await markdownFiles.getMdx(slug);
	return {
		props: {
			meta,
			mdx,
			mdxNav,
		},
	};
};*/

const Styles = styled.div`
	display: block;
`;
