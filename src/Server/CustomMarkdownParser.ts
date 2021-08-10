import { JSONSchema7 } from "json-schema";
import os from "os";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { toKebabCase, toPascalCase } from "Utility/TextCaseConversions";

import { getChaletFile } from "./ChaletFile";
import { getChaletSchema } from "./ChaletSchema";
import { jsonNodeToMarkdown } from "./MarkdownPreprocessor";
import { ResultPageAnchor } from "./ResultTypes";

const trimLineBreaksFromEdges = (text: string) => {
	while (text.endsWith("\n") || text.endsWith("\r")) {
		text = text.slice(0, -1);
	}
	return text;
};

const parseExplicitLineBreaks = (text: string): string => {
	text = text.replace(/\n\\\n/g, `\n<Spacer />\n`);
	return text.replace(/\n\\\\\n/g, `\n<Spacer size="lg" />\n`);
};

const parseImportantNotes = (text: string): string => {
	return text.replace(/!> (.*)/g, `<p className="tip">$1</p>`);
};

const parsePageHeaders = (text: string): string => {
	return text.replace(/!# (.+)/g, `<PageHeading>$1</PageHeading>`);
};

const parseAnchoredHeaders = (text: string): string => {
	return text.replace(/(#{1,6}) \[(.+)\](?!\()(.*?)\n/g, (match: string, p1: string, p2: string) => {
		return `<AnchoredH${p1.length}>${p2.replace(/\{/g, '{"{').replace(/\}/g, '}"}')}</AnchoredH${p1.length}>\n`;
	});
};

const parseTabs = (text: string): string => {
	return text.replace(
		/<!-- tabs:start -->\n{1,3}((.|\n)*?)<!-- tabs:end -->/g,
		(match: string, p1: string, p2: string) => {
			p1 = trimLineBreaksFromEdges(p1);

			if (p1.startsWith("|")) p1 = p1.substr(1);

			const tabArray = p1.replace(/(\n{1,3}\||\|\n{1,3})/g, "|").split("|");
			if (tabArray.length % 2 == 1) return "";

			let retString: string = `<TabbedContent>`;
			for (let i = 0; i < tabArray.length; i += 2) {
				retString += `<button>${tabArray[i]}</button><div className="tab-content">

${tabArray[i + 1]}

</div>`;
			}
			retString += `</TabbedContent>`;
			return retString;
		}
	);
};

const parseAccordions = (text: string): string => {
	return text.replace(
		/<!-- accordion:start(.*?) -->((.|\n)*?)<!-- accordion:end -->/g,
		(match: string, p1: string, p2: string) => {
			let retString: string = p1.length > 0 ? `<Accordion label="${p1}">` : `<Accordion>`;
			retString += p2;
			retString += `</Accordion>`;
			return retString;
		}
	);
};

let schemaCache: Dictionary<JSONSchema7 | undefined> = {};

const initializeSchema = async (ref: string): Promise<JSONSchema7 | undefined> => {
	try {
		if (schemaCache[ref] === undefined) {
			const { schema } = await getChaletSchema(ref);
			schemaCache[ref] = schema;
		}

		return schemaCache[ref];
	} catch (err) {
		throw err;
	}
};

const getSchemaPageDefinitions = async (ref?: string): Promise<string[]> => {
	try {
		const schema = await initializeSchema(ref ?? "main");
		const definitions = (schema?.["definitions"] as Dictionary<JSONSchema7> | undefined) ?? {};

		let ret: string[] = [];
		for (const [key, value] of Object.entries(definitions)) {
			if (!!value && !!value["type"] && (value["type"] === "object" || value["type"] === undefined)) {
				ret.push(key);
			}
		}
		return ret;
	} catch (err) {
		throw err;
	}
};

const getSchemaPageAnchors = async (branch?: string): Promise<ResultPageAnchor[]> => {
	try {
		const keys = await getSchemaPageDefinitions(branch);
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
	} catch (err) {
		throw err;
	}
};

const getPageAnchors = async (fileContent: string, slug: string, branch?: string): Promise<ResultPageAnchor[]> => {
	try {
		if (slug === "schema" || slug === "schema-dev") {
			return await getSchemaPageAnchors(branch);
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
	} catch (err) {
		throw err;
	}
};

let readmeCache: Optional<string> = null;

const parseReadme = async (inText: string): Promise<string> => {
	try {
		// if (!readmeCache) {
		let { changelog: text } = await getChaletFile("README.md");
		if (!!text) {
			text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

			text = text.replace(/---\n### (.+?)\n/g, "|$1|");

			text = text.replace(/## (.+?)\n/g, "");

			text = text.replace(/\n/g, os.EOL);
			readmeCache = text;
		}
		// }

		return inText.replace(`!!ChaletReadme!!`, (match: string) => {
			let result: string = "";
			if (!!readmeCache) {
				result += readmeCache;
			}
			return result;
		});
	} catch (err) {
		throw err;
	}
};

let changelogCache: Optional<string> = null;

const parseChangelog = async (inText: string): Promise<string> => {
	try {
		if (!changelogCache) {
			let { changelog: text } = await getChaletFile("CHANGELOG.md");
			if (!!text) {
				text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

				text = text.replace(/\[commit\]\((.+?)\)/g, (result: string, p1: string) => {
					const commit = p1.split("/").pop();
					if (!commit) return p1;

					return `([${commit?.substr(0, 7)}](${p1}))`;
				});
				text = text.replace(/\[issue\]\((.+?)\)/g, (result: string, p1: string) => {
					const issue = p1.split("/").pop();
					if (!issue) return p1;

					return `([#${issue}](${p1}))`;
				});
				text = text.replace(/## \[(.+?)\] \[(.+?)\]/g, "---\n\n## [$1]\n\n$2");

				text = text.replace(/\n/g, os.EOL);
				changelogCache = text;
			}
		}

		return inText.replace(`!!ChaletChangelog!!`, (match: string) => {
			let result: string = "";
			if (!!changelogCache) {
				result += changelogCache;
			}
			return result;
		});
	} catch (err) {
		throw err;
	}
};

const parseSchemaReference = async (text: string, slug: string, branch: string): Promise<string> => {
	try {
		const schema = await initializeSchema(branch);

		return text.replace(`!!ChaletSchemaReference!!`, (match: string) => {
			let result: string = "";
			if (!!schema) {
				result += jsonNodeToMarkdown("$root", `${slug}/${branch}`, schema);
				result += `\`\`\`json
${JSON.stringify({ ...schema, definitions: undefined }, undefined, 3)}
\`\`\`\n\n`;
			}
			return result;
		});
	} catch (err) {
		throw err;
	}
};

const parseSchemaDefinition = async (
	text: string,
	slug: string,
	branch: string,
	definition: string
): Promise<string> => {
	try {
		const schema = await initializeSchema(branch);

		return text.replace(`!!ChaletSchemaReference!!`, (match: string) => {
			let result: string = "";
			if (!!schema) {
				const definitions = schema["definitions"] as Dictionary<JSONSchema7> | undefined;

				result += `#### [${toPascalCase(definition)}]\n\n`;
				result += jsonNodeToMarkdown(null, `${slug}/${branch}`, definitions?.[definition] ?? null, definitions);
				result += `\`\`\`json
${JSON.stringify(definitions?.[definition] ?? {}, undefined, 3)}
\`\`\`\n\n`;
			}
			return result;
		});
	} catch (err) {
		throw err;
	}
};

let definitionsCache: Dictionary<string[]> = {};

const getSchemaReferencePaths = async (branch: string): Promise<string[]> => {
	try {
		if (!definitionsCache[branch]) {
			definitionsCache[branch] = await getSchemaPageDefinitions(branch);
		}
		const paths = definitionsCache[branch].map((def) => `${branch}/${def}`);
		const result: string[] = [branch, ...paths];
		return result;
	} catch (err) {
		throw err;
	}
};

const parseCustomMarkdown = async (
	text: string,
	slug: string,
	branch?: string,
	definition?: string
): Promise<string> => {
	try {
		// First, ensure consistent line endings to make regex patterns easier
		text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

		if (slug === "changelog") {
			text = await parseChangelog(text);
		}

		if (slug === "getting-started") {
			text = await parseReadme(text);
		}

		// Parse the things
		if (!!branch) {
			if (!!definition) {
				text = await parseSchemaDefinition(text, slug, branch, definition);
			} else {
				text = await parseSchemaReference(text, slug, branch);
			}
		}

		text = parseExplicitLineBreaks(text);
		text = parseImportantNotes(text);
		text = parsePageHeaders(text);
		text = parseAnchoredHeaders(text);
		text = parseAccordions(text);
		text = parseTabs(text);

		// Set line endings back
		text = text.replace(/\n/g, os.EOL);

		return text;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export { parseCustomMarkdown, getPageAnchors, getSchemaReferencePaths, getSchemaPageAnchors };
