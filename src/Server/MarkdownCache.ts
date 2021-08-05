import fs from "fs";
import matter from "gray-matter";
import { flatten } from "lodash";
import path from "path";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { mdpages } from "Server/MarkdownFiles";
import { recursiveDirectorySearch } from "Server/RecursiveDirectorySearch";

import { getChaletBranches } from "./ChaletBranches";
import { getChaletTags } from "./ChaletTags";
import { getSchemaReferencePaths } from "./CustomMarkdownParser";

const removeIrrelevantMarkdown = (text: string): string => {
	text = text.replace(/<!--(.+?)-->/g, " ");
	text = text.replace(/!!(.+?)!!/g, " ");
	text = text.replace(/\[(.*?)\]\((.*?)\)+/g, (_: string, p1: string, p2: string) => p1);
	text = text.replace(/```((.|[\r\n])*?)```/g, " ");
	text = text.replace(/`(([.\r\n])*?)`/g, (_: string, p1: string, p2: string) => ` ${p2} `);
	text = text.replace(/<((.|[\r\n])*?)>/g, " ");
	text = text.replace(/[>\[\]|*-]/g, " ");
	text = text.replace(/\r/g, "");
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

let data: Dictionary<string[]> = {};

const getPagesCache = async (): Promise<PageCache[]> => {
	try {
		if (!data["pages"]) {
			data["pages"] = await recursiveDirectorySearch(mdpages, ["mdx", "md"]);
		}
		const internalPage = path.join(path.sep, mdpages, "_");
		const schemaPage = path.join(path.sep, mdpages, "schema");
		const pageNormal = data["pages"]
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

		if (!data["tags"]) {
			data["tags"] = await getChaletTags();
		}
		const tagPaths: string[] = flatten(await Promise.all(data["tags"].map((b) => getSchemaReferencePaths(b))));

		if (!data["branches"]) {
			data["branches"] = await getChaletBranches();
		}
		const branchPaths: string[] = flatten(
			await Promise.all(data["branches"].map((b) => getSchemaReferencePaths(b)))
		);

		const schemaPageContentRaw = fs.readFileSync(path.join(process.cwd(), schemaPage, "index.mdx"), "utf8");
		const { data: schemaPageMeta, content: schemaPageContent } = matter(schemaPageContentRaw);

		const schemaPaths = [...tagPaths.map((p) => `/schema/${p}`), ...branchPaths.map((p) => `/schema-dev/${p}`)];
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
	} catch (err) {
		throw err;
	}
};

export { getPagesCache };
