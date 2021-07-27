import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import path from "path";
import React, { useEffect } from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { docsApi, MDXResult } from "Api";
import { Page } from "Components";
import { AnchoredHeading, Heading } from "Components/Heading";
import { dynamic, handleInitialProps, ServerProps } from "Utility";

type Props = ServerProps<
	MDXResult & {
		children?: React.ReactNode;
	}
>;

const components: Dictionary<React.ComponentType<any>> = {
	...AnchoredHeading,
	h1: Heading.h1,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	inlineCode: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
};

const MarkdownPage = ({ meta, mdx, error, children }: Props) => {
	const router = useRouter();

	useEffect(() => {
		if (!!error) {
			router.replace("/404", router.asPath, {
				shallow: true,
			});
		}
	}, [error]);

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
		const navProps = await docsApi.getNavBar();
		const { slug: slugRaw } = ctx.query;
		const slug: string = path.join("docs", typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "");
		const { meta, mdx } = await docsApi.getMdx(slug);
		return {
			...navProps,
			meta,
			mdx,
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
};*/

const Styles = styled.div`
	display: block;
`;
