import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import os from "os";
import nodePath from "path";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { getChaletBranches } from "./ChaletBranches";
import { getChaletTags } from "./ChaletTags";
import { getPageAnchors, parseCustomMarkdown } from "./CustomMarkdownParser";
import { isDevelopment } from "./IsDevelopment";
import { ResultMDXPage, ResultMDX, ResultNavigation, SidebarLink } from "./ResultTypes";

const mdpages: string = "mdpages";
const allowedExtensions: string[] = ["mdx", "md"];
const notFoundPage: string = "_404.mdx";

const cwd = process.cwd();

type FileResult = {
	filename: string;
	isNotFoundPage: boolean;
};

const getFirstExistingPath = (inPath: string, extensions: string[], internal: boolean): FileResult => {
	let arr: string[] = [];
	if (internal || !inPath.startsWith("_")) {
		for (const ext of extensions) {
			arr.push(nodePath.join(cwd, mdpages, `${inPath}.${ext}`));
			arr.push(nodePath.join(cwd, mdpages, inPath, `index.${ext}`));
			arr.push(nodePath.join(cwd, mdpages, inPath, "..", `[id].${ext}`));
		}
	}
	arr.push(nodePath.join(cwd, mdpages, notFoundPage));

	for (const p of arr) {
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

// Originally used to get navigation from _sidebar.mdx
// type GetContentCallback = (content: string) => string;

/*const getPlainMdx = async (slug: string, internal: boolean, onGetContent?: GetContentCallback): Promise<ResultMDX> => {
	try {
		const { filename } = getFirstExistingPath(slug, allowedExtensions, internal);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		let content: string = fs.readFileSync(filename, "utf8");
		if (!!onGetContent) {
			content = onGetContent(content);
		}

		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});
		return mdx;
	} catch (err: any) {
		throw err;
	}
};*/

let linkCache: Dictionary<SidebarLink> = {};

const getLinkFromPageSlug = async (href: string): Promise<SidebarLink> => {
	try {
		if (linkCache[href] !== undefined && !isDevelopment) {
			return linkCache[href];
		}

		const { filename, isNotFoundPage } = getFirstExistingPath(href, allowedExtensions, false);
		if (filename.length === 0 || isNotFoundPage) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, "utf8");

		const { data: meta, content } = matter(fileContent);
		const result = {
			label: meta.title ?? "Untitled",
			href,
		};
		linkCache[href] = result;
		return result;
	} catch (err: any) {
		console.error(err.message);
		return {
			label: "Untitled",
			href,
		};
	}
};

type SidebarResult = SidebarLink | string;

const getSidebarLinks = async (): Promise<SidebarResult[]> => {
	try {
		const sidebarFile: string = nodePath.join(cwd, mdpages, "_sidebar.md");
		if (!fs.existsSync(sidebarFile)) {
			throw new Error("Critical: _sidebar.md was not found");
		}
		const fileContent: string = fs.readFileSync(sidebarFile, "utf8");

		const split = fileContent.split(os.EOL);
		let result: (SidebarLink | string)[] = [];
		for (const line of split) {
			if (line.startsWith("<!--")) continue;

			if (line.startsWith(":")) {
				const id = line.substring(1);
				if (id === "ref-select" || id === "break") {
					result.push(id);
				}
			} else if (line.startsWith("[")) {
				let matches = line.match(/^\[\]\((.+?)\)$/);
				if (!!matches && matches.length === 2) {
					const link = await getLinkFromPageSlug(matches[1]);
					result.push(link);
				}
			} else if (line.length > 0) {
				result.push(line);
			}
		}
		return result;
	} catch (err: any) {
		throw err;
	}
};

let otherData: Optional<{
	branches?: string[];
	tags?: string[];
}> = null;

const getNavBar = async (content: string, slug: string, branch?: string): Promise<ResultNavigation> => {
	try {
		if (!otherData || !otherData.branches || !otherData.tags) {
			otherData = {};

			otherData.branches = await getChaletBranches();
			otherData.tags = await getChaletTags();
		}
		const branchLinks = [...otherData.branches].map((value) => {
			return {
				label: value,
				href: `/schema-dev/${value}`,
			};
		});

		const tagLinks = [...otherData.tags].map((value) => {
			return {
				label: value,
				href: `/schema/${value}`,
			};
		});
		const sidebarLinks = await getSidebarLinks();
		const anchors = await getPageAnchors(content, slug, branch);

		const schemaLinks = [...branchLinks, ...tagLinks];
		return {
			anchors,
			sidebarLinks,
			schemaLinks,
		};
	} catch (err: any) {
		throw err;
	}
};

const getMdxPage = async (
	slug: string,
	query: Dictionary<string | undefined>,
	internal: boolean = false
): Promise<ResultMDXPage> => {
	try {
		const { filename, isNotFoundPage } = getFirstExistingPath(
			slug === "schema-dev" ? "schema" : slug,
			allowedExtensions,
			internal
		);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, "utf8");

		const { definition, branch } = query;
		const { meta, content } = await parseCustomMarkdown(fileContent, slug, branch, definition);

		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});

		const navData = await getNavBar(content, slug, branch);
		const title = meta?.title ?? "Untitled";

		return {
			...navData,
			meta: {
				...meta,
				title,
			},
			mdx,
		};
	} catch (err: any) {
		try {
			console.error(err);
			if ((err.message ?? "").startsWith("File not found")) {
				return await getNotFoundPage();
			} else {
				return await getInternalServerErrorPage();
			}
		} catch (e: any) {
			throw e;
		}
	}
};

const getNotFoundPage = () => getMdxPage("_404", {}, true);

const getInternalServerErrorPage = () => getMdxPage("_500", {}, true);

const markdownFiles = {
	getMdxPage,
	getInternalServerErrorPage,
	getNotFoundPage,
};

export { markdownFiles, mdpages, getLinkFromPageSlug };
