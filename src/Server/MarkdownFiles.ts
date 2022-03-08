import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import os from "os";
import nodePath from "path";

import { Dictionary, Optional } from "@rewrking/react-kitchen";

import { getChaletBranches } from "./ChaletBranches";
import { getChaletReleases } from "./ChaletReleases";
import { getChaletTags } from "./ChaletTags";
import { getPageAnchors, parseCustomMarkdown } from "./CustomMarkdownParser";
import { ResultMDXPage, ResultNavigation, HyperLink, SchemaType, ResultDataPage } from "./ResultTypes";
import { serverCache } from "./ServerCache";

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

const getLinkTitleFromPageSlug = (href: string): Promise<HyperLink> => {
	return serverCache.get(`link-title${href.length > 1 ? href : "/index"}`, async () => {
		const { filename, isNotFoundPage } = getFirstExistingPath(href, allowedExtensions, false);
		if (filename.length === 0 || isNotFoundPage) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, "utf8");
		const { data: meta, content } = matter(fileContent);
		return {
			label: meta.title ?? "Untitled",
			href,
		};
	});
};

type SidebarResult = HyperLink | string;

const getSidebarLinks = (): Promise<SidebarResult[]> => {
	return serverCache.get(`sidebar-links`, async () => {
		const sidebarFile: string = nodePath.join(cwd, mdpages, "_sidebar.md");
		if (!fs.existsSync(sidebarFile)) {
			throw new Error("Critical: _sidebar.md was not found");
		}
		const fileContent: string = fs.readFileSync(sidebarFile, "utf8");

		const split = fileContent.split(os.EOL);
		let result: (HyperLink | string)[] = [];
		for (const line of split) {
			if (line.startsWith("<!--")) continue;

			if (line.startsWith(":")) {
				const id = line.substring(1);
				if (id === "break") {
					result.push(id);
				}
			} else if (line.startsWith("[")) {
				let matches = line.match(/^\[(.*)\]\((.+?)\)$/);
				if (!!matches) {
					if (matches.length === 3) {
						const track = matches[1] === "@";
						if (matches[1].length === 0 || track) {
							const link = await getLinkTitleFromPageSlug(matches[2]);
							result.push({
								...link,
								track,
							});
						} else {
							result.push({
								href: matches[2],
								label: matches[1],
							});
						}
					}
				}
			} else if (line.length > 0) {
				result.push(line);
			}
		}
		return result;
	});
};

const getNavBar = async (
	slug: string,
	content: string = "",
	schemaType?: SchemaType,
	ref?: string
): Promise<ResultNavigation> => {
	const [branches, tags, sidebarLinks, anchors] = await Promise.all([
		getChaletBranches(),
		getChaletTags(),
		getSidebarLinks(),
		getPageAnchors(content, slug, ref, schemaType),
	]);
	const schemaLinks: HyperLink[] = [...branches, ...tags].map((value) => {
		return {
			label: value,
			href: `/schema/${value}/${schemaType}`,
		};
	});
	return {
		anchors,
		sidebarLinks,
		schemaLinks,
	};
};

const getMdxPage = async (
	slug: string,
	query: Dictionary<string | undefined>,
	internal: boolean = false
): Promise<ResultMDXPage> => {
	const { definition, ref } = query;

	const schemaType = query.type as SchemaType | undefined;
	if (
		!!schemaType &&
		schemaType !== SchemaType.ChaletJson &&
		schemaType !== SchemaType.SettingsJson &&
		!slug.startsWith("-")
	) {
		throw new Error(`Invalid schema type requested: ${schemaType}`);
	}

	const { filename, isNotFoundPage } = getFirstExistingPath(slug, allowedExtensions, internal);
	if (filename.length === 0) {
		throw new Error(`File not found: ${filename}`);
	}

	const fileContent: string = fs.readFileSync(filename, "utf8");

	const { meta, content } = await parseCustomMarkdown(fileContent, slug, ref, schemaType, definition);

	const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
		parseFrontmatter: false,
	});

	const navData = await getNavBar(slug, content, schemaType, ref);
	const title = meta?.title ?? "Untitled";

	return {
		...navData,
		meta: {
			...meta,
			title,
		},
		mdx,
	};
};

const getNotFoundPage = () => getMdxPage("_404", {}, true);

const getInternalServerErrorPage = () => getMdxPage("_500", {}, true);

const getPageWithData = async (slug: string, query: Dictionary<boolean>): Promise<ResultDataPage> => {
	const { getReleases } = query;

	const navData = await getNavBar(slug);
	const data: ResultDataPage = {
		...navData,
	};

	if (!!getReleases) {
		data.releases = await getChaletReleases();
	}

	return data;
};

const markdownFiles = {
	getMdxPage,
	getInternalServerErrorPage,
	getNotFoundPage,
};

export { markdownFiles, mdpages, getLinkTitleFromPageSlug, getPageWithData };
