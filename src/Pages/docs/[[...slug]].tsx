import fs from "fs";
import matter from "gray-matter";
import { GetStaticPropsContext } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import React from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { Page } from "Components";
import { dynamic, recursiveDirectorySearch } from "Utility";

type Props = {
	children?: React.ReactNode;
	meta: {
		title?: string;
		author?: string;
	};
	markdown: MDXRemoteSerializeResult<Record<string, unknown>>;
};

const components: Dictionary<React.ComponentType<any>> = {
	a: dynamic.component("Link"),
	pre: dynamic.component("Code"),
};

const MarkdownTest = ({ meta, markdown }: Props) => {
	return (
		<Page title={meta?.title ?? "Untitled"}>
			<Styles>{!!markdown ? <MDXRemote {...markdown} components={components} /> : <div>Error 🙀</div>}</Styles>
		</Page>
	);
};

export default MarkdownTest;

export const getStaticPaths = async () => {
	try {
		const pathsRaw = await recursiveDirectorySearch(path.sep + "docs", ["md", "mdx"]);
		const paths = pathsRaw.map((inPath: string): string => {
			let result: string = inPath.substring(0, inPath.lastIndexOf("."));
			result = result.replaceAll(/\\/g, "/");
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

const getFirstExistingPath = (inPath: string, extensions: string[]): string => {
	let arr: string[] = [];
	for (const ext of extensions) {
		arr.push(path.join(process.cwd(), `${inPath}.${ext}`));
		arr.push(path.join(process.cwd(), inPath, `index.${ext}`));
	}
	for (const p of arr) {
		// console.log(p);
		if (fs.existsSync(p)) {
			return p;
		}
	}
	return "";
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
	try {
		if (!!params) {
			const { slug: slugRaw } = params;

			const slug = typeof slugRaw === "string" ? slugRaw : slugRaw?.join(path.sep) ?? "";
			const filename: string = getFirstExistingPath(path.join("docs", slug), ["mdx", "md"]);
			// console.log("filename:", filename);
			if (filename.length === 0) {
				throw new Error(`File not found: ${filename}`);
			}

			const fileContent: string = fs.readFileSync(filename, {
				encoding: "utf8",
			});
			const { data: meta, content } = matter(fileContent);
			const markdown: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content);
			return {
				props: {
					meta,
					markdown,
				},
			};
		} else {
			throw new Error("Params not found");
		}
	} catch (err) {
		console.error(err.message);
		return {
			props: {
				error: {
					message: err.message,
					status: err.status ?? 500,
				},
			},
		};
	}
};

const Styles = styled.div`
	display: block;
`;
