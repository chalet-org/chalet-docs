import matter from "gray-matter";
import { JSONSchema7 } from "json-schema";
import os from "os";

import { Dictionary } from "Utility";
import { replaceAsync } from "Utility/ReplaceAsync";
import { toKebabCase, toPascalCase } from "Utility/TextCaseConversions";

import { getChaletFile } from "./ChaletFile";
import { getChaletSchema } from "./ChaletSchema";
import { getLatestTag } from "./ChaletTags";
import { getLinkTitleFromPageSlug } from "./MarkdownFiles";
import { processJsonSchemaToMarkdown } from "./MarkdownPreprocessor";
import { ResultPageAnchor, SchemaType } from "./ResultTypes";
import { serverCache } from "./ServerCache";

const trimLineBreaksFromEdges = (text: string) => {
	while (text.endsWith("\n") || text.endsWith("\r")) {
		text = text.slice(0, -1);
	}
	return text;
};

const parseTables = (text: string) => {
	const ret = text.replace(
		/(((\| ([\w\d` -:,~\=\(\)\[\]\{\}\$\?\/\\]+))+ \|\n)+)\n/g,
		(_match: string, p1: string) => {
			let thead: string = "";
			let rows: string[] = [];
			const rest = p1.replace(
				/((\| ([\w\d` -:,~\=\(\)\[\]\{\}\$\?\/\\]+))+ \|\n)((\| ([- ]+))+ \|\n)/,
				(tmatch: string, tp1: string) => {
					const labels: string[] =
						tp1.match(/ ([\w\d` -:,~\=\(\)\[\]\{\}\$\?\/\\]+) /g)?.map((th: string) => `<th>${th}</th>`) ??
						[];
					thead = `<thead><tr>${labels.join("")}</tr></thead>`;
					return "";
				}
			);

			rest.replace(/((\| ([\w\d` -:,~\=\(\)\[\]\{\}\$\?\/\\]+))+ +\|\n)/g, (tmatch: string, tp1: string) => {
				let labels: string[] =
					tp1.match(/ ([\w\d` -:,~\=\(\)\[\]\{\}\$\?\/\\]*) /g)?.map((th: string) => `<td>${th}</td>`) ?? [];
				rows.push(`<tr>${labels.join("")}</tr>`);
				return "";
			});

			return `<div className="table-container"><table>${thead}<tbody>${rows.join("")}</tbody></table></div>\n\n`;
		}
	);

	return ret;
};

const parseExplicitLineBreaks = (text: string): string => {
	text = text.replace(/\n\\\n/g, `\n<Spacer />\n`);
	return text.replace(/\n\\\\\n/g, `\n<Spacer size="lg" />\n`);
};

const parseImportantNotes = (text: string): string => {
	return text.replace(/!> (.*)/g, `<ImportantNote>$1</ImportantNote>`);
};

const parseAnchoredHeaders = (text: string): string => {
	return text.replace(/(#{1,6}) \[(.+)\](?!\()(.*?)\n/g, (match: string, p1: string, p2: string) => {
		return `<AnchoredH${p1.length}>${p2.replace(/\{/g, '{"{').replace(/\}/g, '}"}')}</AnchoredH${p1.length}>\n`;
	});
};

const parseCodeHeaders = (text: string): string => {
	return text.replace(/\n``(.+)``/g, (match: string, p1: string) => {
		return `\n<CodeHeader>{"${p1}"}</CodeHeader>`;
	});
};

const parseDescriptionList = (text: string): string => {
	return text.replace(/\[\[dl:start\]\]((.|\n)*?)\[\[dl:end\]\]/g, (match: string, p1: string) => {
		let retString: string = `<dl>`;
		retString += p1;
		retString += `</dl>`;
		return retString;
	});
};

const parseBottomPageNavigation = (text: string): Promise<string> => {
	return replaceAsync(
		text,
		/\[\[nav:(\/?[a-z\/-]*?):(\/?[a-z\/-]*?)\]\]/g,
		async (match: string, p1: string, p2: string) => {
			let nav = "<PageNavigation";
			if (p1.length > 0) {
				const link = await getLinkTitleFromPageSlug(p1);
				nav += ` left={{ to: "${link.href}", label: "${link.label}" }}`;
			}
			if (p2.length > 0) {
				const link = await getLinkTitleFromPageSlug(p2);
				nav += ` right={{ to: "${link.href}", label: "${link.label}" }}`;
			}
			nav += " />";
			return `\n${nav}\n`;
		}
	);
};

const parseTabs = (text: string): string => {
	return text.replace(
		/\[\[tabs:start\]\]\n{1,3}((.|\n)*?)\[\[tabs:end\]\]/g,
		(match: string, p1: string, p2: string) => {
			p1 = trimLineBreaksFromEdges(p1);

			if (p1.startsWith("|")) p1 = p1.substring(1);

			const tabArray = p1.replace(/(\n{1,3}\||\|\n{1,3})/g, "|").split("|");
			if (tabArray.length % 2 == 1) return "";

			let retString: string = `<TabbedContent>\n`;
			for (let i = 0; i < tabArray.length; i += 2) {
				retString += `<button>${tabArray[i]}</button>\n<div className="tab-content">

${tabArray[i + 1]}

</div>\n`;
			}
			retString += `</TabbedContent>`;
			return retString;
		}
	);
};

const parseAccordions = (text: string): string => {
	return text.replace(
		/\[\[accordion:start\s?(.*?)\]\]((.|\n)*?)\[\[accordion:end\]\]/g,
		(match: string, p1: string, p2: string) => {
			let retString: string = p1.length > 0 ? `<Accordion label="${p1}">` : `<Accordion>`;
			retString += p2;
			retString += `</Accordion>`;
			return retString;
		}
	);
};

const getSchemaPageDefinitions = async (type: SchemaType, ref?: string): Promise<string[]> => {
	const { schema } = await getChaletSchema(type, ref);
	const definitions = (schema?.["definitions"] as Dictionary<JSONSchema7> | undefined) ?? {};

	let ret: string[] = [];
	for (const [key, value] of Object.entries(definitions)) {
		if (!!value && !!value["type"] && (value["type"] === "object" || value["type"] === undefined)) {
			ret.push(key);
		}
	}
	return ret;
};

const getSchemaPageAnchors = async (type: SchemaType, ref?: string): Promise<ResultPageAnchor[]> => {
	const keys = await getSchemaPageDefinitions(type, ref);
	let anchors: ResultPageAnchor[] = keys.map((key) => {
		return {
			text: toPascalCase(key),
			to: `/${key}`,
		};
	});
	anchors.sort((a, b) => {
		return a.text > b.text ? 1 : -1;
	});
	return anchors;
};

const getPageAnchors = async (
	fileContent: string,
	slug: string,
	ref?: string,
	type?: SchemaType
): Promise<ResultPageAnchor[]> => {
	if (slug === "download") {
		return [];
	} else if (!!type && slug === "schema") {
		return await getSchemaPageAnchors(type, ref);
	} else {
		let anchors: ResultPageAnchor[] = [];

		const split = fileContent.split(os.EOL);
		for (const line of split) {
			let matches = line.match(/^<AnchoredH(\d)>(.+?)<\/AnchoredH\d>$/);
			if (!!matches && matches.length === 3) {
				// ignore H1 as it's already in the sidebar
				if (matches[1] === "1") continue;

				anchors.push({
					text: matches[2],
					to: `?id=${toKebabCase(matches[2])}`,
				});
			}
		}
		return anchors;
	}
};

const parseCompileMd = async (inText: string): Promise<string> => {
	const readme = await serverCache.get(`chalet-compile-md`, async () => {
		const tag = await getLatestTag();
		let { text } = await getChaletFile("COMPILE.md", tag);
		if (!!text) {
			text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n"); // just in-case, make line breaks consistent

			text = text.replace(/---\n### (.+?)\n/g, "|$1|"); // remove hrs & replace headers with tabs

			text = text.replace(/## (.+?)\n/g, ""); // remove
			text = text.replace(/\(https:(.+)\)/g, "($1)"); // strip out https: from links
			text = text.substring(text.indexOf("|")); // go to first tab
		}
		return text ?? "";
	});

	return inText.replace(`!!ChaletCompileMd!!`, readme);
};

const parseSchemaReference = async (type: SchemaType, text: string, slug: string, ref: string): Promise<string> => {
	const { schema } = await getChaletSchema(type, ref);

	return text.replace(`!!ChaletSchemaReference!!`, (match: string) => {
		let result: string = "";
		if (!!schema) {
			result += processJsonSchemaToMarkdown("(root)", `${slug}/${ref}/${type}`, schema);
		}
		return result;
	});
};

const parseMdxSyntax = (text: string) => {
	return text.replace(/\$\{([\w:\(\)]+)\}/g, "\\$\\{$1\\}");
};

const parseSchemaDefinition = async (
	type: SchemaType,
	text: string,
	slug: string,
	ref: string,
	definition: string
): Promise<string> => {
	const { schema } = await getChaletSchema(type, ref);

	return text.replace(`!!ChaletSchemaReference!!`, (match: string) => {
		let result: string = "";
		if (!!schema) {
			const definitions = schema["definitions"] as Dictionary<JSONSchema7> | undefined;

			if (definitions === undefined || definitions[definition] === undefined) {
				throw new Error(`Schema definition not found: ${definition}`);
			}

			const markdown = processJsonSchemaToMarkdown(
				null,
				`${slug}/${ref}/${type}`,
				definitions[definition],
				definitions
			);

			result += `#### [${toPascalCase(definition)}]\n\n`;
			result += markdown;
		}
		return result;
	});
};

const getSchemaReferencePaths = (type: SchemaType, ref: string): Promise<string[]> => {
	return serverCache.get(`schema-definition/${type}/${ref}`, async () => {
		let defs: string[];
		if (ref === "latest") {
			defs = await getSchemaPageDefinitions(type);
		} else {
			defs = await getSchemaPageDefinitions(type, ref);
		}
		const paths = defs.map((def) => `${ref}/${type}/${def}`);
		const result: string[] = [`${ref}/${type}`, ...paths];
		return result;
	});
};

const parseCustomMarkdown = async (
	inContent: string,
	slug: string,
	ref?: string,
	schemaType?: SchemaType,
	definition?: string
): Promise<{
	meta: Dictionary<any>;
	content: string;
}> => {
	// First, ensure consistent line endings to make regex patterns easier
	inContent = inContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	let { data: meta, content: text } = matter(inContent);

	text = parseReferencedMetaData(text, meta);

	if (slug.endsWith("getting-started")) {
		text = await parseCompileMd(text);
	}

	// Parse the things
	if (!!ref && !!schemaType) {
		if (!!definition) {
			text = await parseSchemaDefinition(schemaType, text, slug, ref, definition);
		} else {
			text = await parseSchemaReference(schemaType, text, slug, ref);
		}
	}
	text = await parseBottomPageNavigation(text);

	text = parseTables(text);
	text = parseExplicitLineBreaks(text);
	text = parseImportantNotes(text);
	text = parseAnchoredHeaders(text);
	text = parseAccordions(text);
	text = parseTabs(text);
	text = parseCodeHeaders(text);
	text = parseDescriptionList(text);

	if (slug === "schema") {
		text = parseMdxSyntax(text);
	}

	// Set line endings back
	text = text.replace(/\n/g, os.EOL);

	return {
		meta,
		content: text,
	};
};

const parseReferencedMetaData = (text: string, meta: Dictionary<any>) => {
	text = text.replace(/\$\{meta\.(\w+?)\}/g, (match: string, p1: string) => {
		if (typeof p1 === "string" && p1.length > 0 && meta[p1] !== undefined) {
			return meta[p1];
		} else {
			return match;
		}
	});
	return text;
};

export { parseCustomMarkdown, getPageAnchors, getSchemaReferencePaths, getSchemaPageAnchors };
