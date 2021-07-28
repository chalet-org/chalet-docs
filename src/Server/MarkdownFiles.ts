import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import os from "os";
import path from "path";

import { toKebabCase } from "Utility/ToKebabCase";

import { getChaletSchema } from "./ChaletSchema";
import { ResultMDXPage, ResultMDX, ResultMDXNav } from "./ResultTypes";

const mdpages: string = "mdpages";
const allowedExtensions: string[] = ["mdx", "md"];
const notFoundPage: string = "_404.mdx";

type FileResult = {
	filename: string;
	isNotFoundPage: boolean;
};

const getFirstExistingPath = (inPath: string, extensions: string[], internal: boolean): FileResult => {
	let arr: string[] = [];
	if (internal || !inPath.startsWith(path.join(mdpages, "_"))) {
		for (const ext of extensions) {
			arr.push(path.join(process.cwd(), `${inPath}.${ext}`));
			arr.push(path.join(process.cwd(), inPath, `index.${ext}`));
		}
	}
	arr.push(path.join(process.cwd(), mdpages, notFoundPage));
	for (const p of arr) {
		// console.log(p);
		if (fs.existsSync(p)) {
			return {
				filename: p,
				isNotFoundPage: p.endsWith(notFoundPage),
			};
		}
	}
	return {
		filename: "",
		isNotFoundPage: false,
	};
};

const parseCustomMarkdown = (text: string): string => {
	text = text.replace(/!> (.*)/g, `<p className="tip">$1</p>`);
	text = text.replace(/!# (.+)/g, `<PageHeading>$1</PageHeading>`);
	text = text.replace(/(#{1,6}) \[(.+)\]/g, (match: string, p1: string, p2: string) => {
		return `<AnchoredH${p1.length}>${p2}</AnchoredH${p1.length}>`;
	});
	return text;
};

type GetContentCallback = (content: string) => string;

const getPlainMdx = async (slug: string, internal: boolean, onGetContent?: GetContentCallback): Promise<ResultMDX> => {
	try {
		const { filename } = getFirstExistingPath(path.join(mdpages, slug), allowedExtensions, internal);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		let content: string = fs.readFileSync(filename, {
			encoding: "utf8",
		});
		if (!!onGetContent) {
			content = onGetContent(content);
		}

		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});
		return mdx;
	} catch (err) {
		throw err;
	}
};

const getNavBar = async (onGetContent?: GetContentCallback): Promise<ResultMDXNav> => {
	try {
		const mdxNav = await getPlainMdx("_navbar", true, onGetContent);
		return {
			mdxNav,
		};
	} catch (err) {
		throw err;
	}
};

type PageAnchor = {
	text: string;
	to: string;
};

const getPageAnchors = (fileContent: string): PageAnchor[] => {
	let matches: string[] = [];
	const split = fileContent.split(os.EOL);
	for (const line of split) {
		const m = line.match(/^(#{1,6}) \[(.+)\]$/);
		if (m && m.length === 3) {
			matches.push(m[2]);
		}
	}

	let anchors: PageAnchor[] = matches.map((match) => {
		return {
			text: match,
			to: toKebabCase(match),
		};
	});

	return anchors;
};

const getMdxPage = async (slug: string, internal: boolean = false): Promise<ResultMDXPage> => {
	try {
		const { filename, isNotFoundPage } = getFirstExistingPath(
			path.join(mdpages, slug),
			allowedExtensions,
			internal
		);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, {
			encoding: "utf8",
		});
		const anchors = getPageAnchors(fileContent);

		const { data: meta, content } = matter(parseCustomMarkdown(fileContent));
		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});

		const { mdxNav } = await getNavBar((content) => {
			if (isNotFoundPage) {
				return content;
			}
			return content.replace(/[\n\r]\* \[([\w\s]+)\]\((.+)\)/g, (match: string, p1: string, p2: string) => {
				if (p2.substr(1) === slug) {
					if (anchors.length > 0) {
						const pageAnchors = anchors
							.map((anchor) => `    * [${anchor.text}](${p2}?id=${anchor.to})`)
							.join(os.EOL);

						return `${os.EOL}* [${p1}](${p2})${os.EOL}${pageAnchors}`;
					}
				}
				return match;
			});
		});

		let other: object = {};
		if (slug === ".") {
			const { schema } = await getChaletSchema();
			other["schema"] = schema;
		}

		return {
			meta: {
				...meta,
				title: meta?.title ?? "Untitled",
			},
			mdx,
			mdxNav,
			...other,
		};
	} catch (err) {
		throw err;
	}
};

const getNotFoundPage = () => getMdxPage("_404", true);

const markdownFiles = {
	getNavBar,
	getMdxPage,
	getNotFoundPage,
};

export { markdownFiles };
