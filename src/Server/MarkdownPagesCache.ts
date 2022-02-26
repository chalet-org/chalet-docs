import fs from "fs";
import matter from "gray-matter";
import flatten from "lodash/flatten";
import path from "path";

import { mdpages } from "Server/MarkdownFiles";
import { recursiveDirectorySearch } from "Server/RecursiveDirectorySearch";

import { getChaletBranches } from "./ChaletBranches";
import { getChaletTags } from "./ChaletTags";
import { getSchemaReferencePaths } from "./CustomMarkdownParser";
import { SchemaType } from "./ResultTypes";
import { serverCache } from "./ServerCache";

const removeIrrelevantMarkdown = (text: string): string => {
	text = text.replace(/<!--(.+?)-->/g, " ");
	text = text.replace(/!!(.+?)!!/g, " ");
	text = text.replace(/\[(.*?)\]\((.*?)\)+/g, (_: string, p1: string, p2: string) => p1);
	text = text.replace(/```((.|[\r\n])*?)```/g, " ");
	text = text.replace(/`(([.\r\n])*?)`/g, (_: string, p1: string, p2: string) => ` ${p2} `);
	text = text.replace(/<((.|[\r\n])*?)>/g, " ");
	text = text.replace(/[>\[\]|*-]/g, " ");
	text = text.replace(/\r/g, "");
	text = text.replace(/\`/g, "");
	text = text.replace(/[\n ]{2,}/g, "\n");
	text = text.replace(/\n\s*?#{1,}/g, "\n");
	text = text.replace(/( ){2,}/g, " ");
	// console.log(text);
	return text;
};

export type PageCache = {
	id: string;
	url: string;
	title: string;
	content: string;
};

const getPagesCache = (): Promise<PageCache[]> => {
	return serverCache.get(`pages`, async () => {
		const pages = await recursiveDirectorySearch(mdpages, ["mdx", "md"]);
		const internalPage = path.join(path.sep, mdpages, "_");
		const schemaPage = path.join(path.sep, mdpages, "schema");
		const pageNormal = pages
			.filter((file) => !file.startsWith(internalPage) || file.startsWith(schemaPage))
			.map((file) => {
				const id = file
					.replace(path.join(path.sep, mdpages, path.sep), "")
					.replace(/\.(mdx|md)/g, "")
					.replace(/[\/\\]/g, "_");

				const url = file
					.replace(path.join(path.sep, mdpages), "")
					.replace(/\.(mdx|md)/g, "")
					.replace(/\/index$/, "");

				const fileContents = fs.readFileSync(path.join(process.cwd(), file), "utf8");
				const { data: meta, content } = matter(fileContents);

				return {
					id,
					url: url === "" ? "/" : url,
					title: meta.title,
					content: removeIrrelevantMarkdown(content),
				};
			});

		const tags = await getChaletTags();
		const tagPaths: string[] = flatten(
			await Promise.all([
				...tags.map((b) => getSchemaReferencePaths(SchemaType.ChaletJson, b)),
				...tags.map((b) => getSchemaReferencePaths(SchemaType.SettingsJson, b)),
			])
		);

		const branches = await getChaletBranches();
		const branchPaths: string[] = flatten(
			await Promise.all([
				...branches.map((b) => getSchemaReferencePaths(SchemaType.ChaletJson, b)),
				...branches.map((b) => getSchemaReferencePaths(SchemaType.SettingsJson, b)),
			])
		);

		const schemaPageContentRaw = fs.readFileSync(path.join(process.cwd(), schemaPage, "index.mdx"), "utf8");
		const { data: schemaPageMeta, content: schemaPageContent } = matter(schemaPageContentRaw);

		const schemaPaths = [...tagPaths, ...branchPaths].map((p) => `/schema/${p}`);
		const schemaPages = schemaPaths.map((url) => {
			const id = url.replace(/[\/\\]/g, "_");

			return {
				id,
				url,
				title: schemaPageMeta.title,
				content: removeIrrelevantMarkdown(schemaPageContent),
			};
		});

		return [...pageNormal, ...schemaPages];
	});
};

export { getPagesCache };
