import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { mdpages } from "Server/MarkdownFiles";
import { recursiveDirectorySearch } from "Server/RecursiveDirectorySearch";

const removeIrrelevantMarkdown = (text: string): string => {
	text = text.replace(/<!--(.+?)-->/g, " ");
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

const getPagesCache = async (): Promise<PageCache[]> => {
	try {
		const pages = await recursiveDirectorySearch(mdpages, ["mdx", "md"]);
		const internalPage = path.join(path.sep, mdpages, "_");
		const pagesPublic = pages
			.filter((file) => !file.startsWith(internalPage))
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

		return pagesPublic;
	} catch (err) {
		throw err;
	}
};

export { getPagesCache };
