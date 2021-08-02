import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import os from "os";
import path from "path";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { toKebabCase, toPascalCase } from "Utility/TextCaseConversions";

import { getChaletSchema } from "./ChaletSchema";

const trimLineBreaksFromEdges = (text: string) => {
	while (text.endsWith("\n") || text.endsWith("\r")) {
		text = text.slice(0, -1);
	}
	return text;
};

const parseImportantNotes = (text: string): string => {
	return text.replace(/!> (.*)/g, `<p className="tip">$1</p>`);
};

const parsePageHeaders = (text: string): string => {
	return text.replace(/!# (.+)/g, `<PageHeading>$1</PageHeading>`);
};

const parseAnchoredHeaders = (text: string): string => {
	return text.replace(/(#{1,6}) \[(.+)\](?!\()\n/g, (match: string, p1: string, p2: string) => {
		return `<AnchoredH${p1.length}>${p2}</AnchoredH${p1.length}>\n`;
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
				retString += `<button>${tabArray[i]}</button><div className="tab">

${tabArray[i + 1]}

</div>`;
			}
			retString += `</TabbedContent>`;
			return retString;
		}
	);
};

let nameCache: object = {};

const parseJsonNodeToMarkdown = (
	name: Optional<string>,
	schema: Optional<JSONSchema7>,
	definitions?: Dictionary<JSONSchema7Definition>
): string => {
	let result: string = "";
	if (!schema) return result;

	const {
		type,
		description,
		properties,
		patternProperties,
		default: defaultValue,
		enum: enumValue,
		pattern,
		minItems,
		maxItems,
		uniqueItems,
		items,
		examples,
		anyOf,
		oneOf,
		$ref: reference,
		definitions: schemaDefinitions,
	} = schema;

	const cleanName = name
		? name
				.replace(/\^(.+?)[\(\:].+?\$/g, (_: string, p1: string) => {
					return p1;
				})
				.replace(/\^\[.+?\$/g, "$any")
		: null;

	if (!!schemaDefinitions) {
		definitions = schemaDefinitions;

		/*result += Object.entries(schemaDefinitions)
			.map(([key, value]) => {
				if (value["type"] && value["type"] !== "object" && value["type"] !== undefined) return "";

				const split = key.split("-");
				let displayName = split[split.length - 1];
				displayName = displayName.charAt(0).toUpperCase() + displayName.substr(1);
				return `<!-- ${displayName}:definition=${key} -->\n\n`;
			})
			.join("");*/
	}

	if (!!reference) {
		let definitionName = reference.replace(/^#\/definitions\/(.+)$/g, "$1");

		if (!cleanName || !nameCache[cleanName]) {
			if (!!cleanName) {
				// nameCache[cleanName] = true;
				result += `#### [${cleanName}]\n\n`;
			}
		}
		if (
			!!definitions &&
			!!definitions[definitionName] &&
			(!definitions[definitionName]["type"] ||
				(!!definitions[definitionName]["type"] &&
					definitions[definitionName]["type"] !== "object" &&
					definitions[definitionName]["type"] !== undefined))
		) {
			result += parseJsonNodeToMarkdown(null, definitions[definitionName] as JSONSchema7, definitions);
		} else {
			const displayName = toPascalCase(definitionName);
			result += `${cleanName ?? ""}: [${displayName}](/schema-reference?definition=${definitionName})  \n`;
		}
	}

	if (!!type) {
		result += `type: \`${type}\`  \n`;
	}
	if (!!defaultValue) {
		if (typeof defaultValue === "string") {
			result += `default: \`${defaultValue}\`  \n`;
		} else if (typeof defaultValue === "string") {
			result += `default:
\`\`\`json
${JSON.stringify(defaultValue, undefined, 3)}
\`\`\`  \n`;
		}
	}
	if (!!pattern) {
		result += `pattern: \`${pattern}\`  \n`;
	}
	if (!!uniqueItems) {
		result += `uniqueItems: \`${uniqueItems ? "true" : "false"}\`  \n`;
	}
	if (!!minItems) {
		result += `minItems: \`${minItems}\`  \n`;
	}
	if (!!maxItems) {
		result += `maxItems: \`${maxItems}\`  \n`;
	}
	if (!!enumValue) {
		result += `enum: \`${enumValue.join("` `")}\`  \n`;
	}
	if (!!examples && Array.isArray(examples)) {
		result += `examples: \`${examples.join("` `")}\`  \n`;
	}
	if (!!description) {
		result += `\n${description}\n\n`;
	}
	if (!!anyOf) {
		result +=
			`\nanyOf:\n\n` +
			anyOf.map((value, i) => parseJsonNodeToMarkdown(null, value as JSONSchema7, definitions)).join("\n\n");
	}
	if (!!oneOf) {
		result +=
			`\noneOf:\n\n` +
			oneOf.map((value, i) => parseJsonNodeToMarkdown(null, value as JSONSchema7, definitions)).join("\n\n");
	}
	if (!!items) {
		result += `\nitems:\n\n`;
		if (Array.isArray(items)) {
			result += items
				.map((value, i) => parseJsonNodeToMarkdown(null, value as JSONSchema7, definitions))
				.join("");
		} else if (typeof items === "object") {
			result += parseJsonNodeToMarkdown(null, items as JSONSchema7, definitions);
		}
	}
	if (!!cleanName) {
		result += "\n\n---\n\n";
	}

	if (!!properties) {
		result +=
			`\nproperties:\n\n` +
			Object.entries(properties)
				.map(([key, value], i) => parseJsonNodeToMarkdown(key, value as JSONSchema7, definitions))
				.join("");
	}
	if (!!patternProperties) {
		result +=
			`\npatternProperties:\n\n` +
			Object.entries(patternProperties)
				.map(([key, value], i) => parseJsonNodeToMarkdown(key, value as JSONSchema7, definitions))
				.join("");
	}

	return result;
};

let otherData: object = {};

const initializeSchema = async (branch: string): Promise<JSONSchema7 | undefined> => {
	try {
		if (otherData["schema"] === undefined) {
			otherData["schema"] = {};
		}

		if (otherData["schema"][branch] === undefined) {
			const { schema } = await getChaletSchema(branch);
			otherData["schema"][branch] = schema;
		}

		return otherData["schema"][branch];
	} catch (err) {
		throw err;
	}
};

type PageAnchor = {
	text: string;
	to: string;
};

const getPageAnchors = async (fileContent: string, branch?: string, definition?: string): Promise<PageAnchor[]> => {
	try {
		const schema = await initializeSchema(branch ?? "main");
		const definitions = (schema?.["definitions"] as Dictionary<JSONSchema7> | undefined) ?? {};

		let anchors: PageAnchor[] = [];
		const split = fileContent.split(os.EOL);
		if (!!branch) {
			for (const [key, value] of Object.entries(definitions)) {
				if (!!value && !!value["type"] && (value["type"] === "object" || value["type"] === undefined)) {
					anchors.push({
						text: toPascalCase(key),
						to: `definition=${key}`,
					});
				}
			}
			anchors.sort((a, b) => {
				return a.text > b.text ? 1 : -1;
			});
		} else {
			for (const line of split) {
				let m = line.match(/^<AnchoredH\d>(.+?)<\/AnchoredH\d>$/);
				if (m && m.length === 2) {
					anchors.push({
						text: m[1],
						to: `id=${toKebabCase(m[1])}`,
					});
				}
			}
		}

		return anchors;
	} catch (err) {
		throw err;
	}
};

const parseSchemaReference = async (text: string, branch: string): Promise<string> => {
	try {
		const schema = await initializeSchema(branch);

		nameCache = {};
		return text.replace(`!!SchemaReference!!`, (match: string) => {
			let result: string = "";
			if (!!schema) {
				/*result = `\`\`\`json
${JSON.stringify(schema, undefined, 3)}
\`\`\`\n\n`;*/
				result += parseJsonNodeToMarkdown("$root", schema);
			}
			return result;
		});
	} catch (err) {
		throw err;
	}
};

const parseSchemaDefinition = async (text: string, branch: string, definition: string): Promise<string> => {
	try {
		const schema = await initializeSchema(branch);

		nameCache = {};
		return text.replace(`!!SchemaReference!!`, (match: string) => {
			let result: string = "";
			if (!!schema) {
				const definitions = schema["definitions"] as Dictionary<JSONSchema7> | undefined;

				result += parseJsonNodeToMarkdown(definition, definitions?.[definition] ?? null, definitions);
			}
			return result;
		});
	} catch (err) {
		throw err;
	}
};

const parseCustomMarkdown = async (text: string, branch?: string, definition?: string): Promise<string> => {
	try {
		// First, ensure consistent line endings to make regex patterns easier
		text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

		// Parse the things
		if (!!branch) {
			if (!!definition) {
				text = await parseSchemaDefinition(text, branch, definition);
			} else {
				text = await parseSchemaReference(text, branch);
			}
		}

		text = parseImportantNotes(text);
		text = parsePageHeaders(text);
		text = parseAnchoredHeaders(text);
		text = parseTabs(text);

		// Set line endings back
		text = text.replace(/\n/g, os.EOL);

		return text;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export { parseCustomMarkdown, getPageAnchors };
