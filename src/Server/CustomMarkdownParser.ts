import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import os from "os";
import path from "path";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { hashString } from "Utility";
import { toKebabCase, toPascalCase } from "Utility/TextCaseConversions";

import { getChaletSchema } from "./ChaletSchema";
import { ResultPageAnchor } from "./ResultTypes";

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
				retString += `<button>${tabArray[i]}</button><div className="tab">

${tabArray[i + 1]}

</div>`;
			}
			retString += `</TabbedContent>`;
			return retString;
		}
	);
};

const jsonNodeToMarkdown = (
	name: Optional<string>,
	slug: string,
	schema: Optional<JSONSchema7>,
	definitions?: Dictionary<JSONSchema7Definition>,
	indented: boolean = false
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
		additionalProperties,
		required,
	} = schema;

	const cleanName = !!name ? name.replace(/^\^(.+?)\$$/g, "$1") : null;
	// ? name
	// 		.replace(/\^(.+?)[\(\:].+?\$/g, (_: string, p1: string) => {
	// 			return p1;
	// 		})
	// 		.replace(/\^\[.+?\$/g, "$any")
	// : null;

	if (!!schemaDefinitions) {
		definitions = schemaDefinitions;

		/*result += Object.entries(schemaDefinitions)
			.map(([key, value]) => {
				if (value["type"] && value["type"] !== "object" && value["type"] !== undefined) return "";

				let displayName = definitionName.split("-").pop() ?? "";
				displayName = displayName.charAt(0).toUpperCase() + displayName.substr(1);
				return `<!-- ${displayName}:definition=${key} -->\n\n`;
			})
			.join("");*/
	}

	if (!!cleanName) {
		result += `###### [${cleanName}]\n\n`;
	}

	let isNotDefinition: boolean = false;

	if (!!reference) {
		let definitionName = reference.replace(/^#\/definitions\/(.+)$/g, "$1");
		isNotDefinition =
			!!definitions &&
			!!definitions[definitionName] &&
			(!definitions[definitionName]["type"] ||
				(!!definitions[definitionName]["type"] &&
					definitions[definitionName]["type"] !== "object" &&
					definitions[definitionName]["type"] !== undefined));

		if (isNotDefinition) {
			result += jsonNodeToMarkdown(null, slug, definitions![definitionName] as JSONSchema7, definitions);
		} else {
			const displayName = toPascalCase(definitionName);
			result += `type: [${displayName}](/${slug}/${definitionName})  \n`;
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
		result += `pattern: \`${pattern.replace(/^\^(.+?)\$$/g, "$1")}\`  \n`;
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
	if (!!required) {
		result += `required: \`${required.join("` `")}\`  \n`;
	}
	if (!!description) {
		result += `\n${description}\n\n`;
	}
	if (!!anyOf) {
		result +=
			`\n<IndentGroup label="anyOf">\n\n` +
			anyOf
				.map((value, i) => jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, true))
				.join("\n\n") +
			`\n\n</IndentGroup>\n\n`;
	}
	if (!!oneOf) {
		result +=
			`\n<IndentGroup label="oneOf">\n\n` +
			oneOf
				.map((value, i) => jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, true))
				.join("\n\n") +
			`\n\n</IndentGroup>\n\n`;
	}
	if (!!items) {
		result += `\n<IndentGroup label="items">\n\n`;
		if (Array.isArray(items)) {
			result += items
				.map((value, i) => jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, true))
				.join("");
		} else if (typeof items === "object") {
			result += jsonNodeToMarkdown(null, slug, items as JSONSchema7, definitions);
		}
		result += `\n\n</IndentGroup>\n\n`;
	}

	if (!!cleanName) {
		result += `\n\n<Spacer />\n\n`;
	}

	if (!!additionalProperties && typeof additionalProperties === "boolean") {
		result += `additionalProperties: \`${additionalProperties ? "true" : "false"}\`  \n`;
	}
	if (!!properties) {
		result +=
			`\n<IndentGroup label="properties">\n\n` +
			Object.entries(properties)
				.map(([key, value], i) => jsonNodeToMarkdown(key, slug, value as JSONSchema7, definitions, indented))
				.join("") +
			`\n\n</IndentGroup>\n\n`;
	}
	if (!!patternProperties) {
		result +=
			`\n<IndentGroup label="patternProperties">\n\n` +
			Object.entries(patternProperties)
				.map(([key, value], i) => jsonNodeToMarkdown(key, slug, value as JSONSchema7, definitions, indented))
				.join("") +
			`\n\n</IndentGroup>\n\n`;
	}

	return result;
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
				let m = line.match(/^<AnchoredH\d>(.+?)<\/AnchoredH\d>$/);
				if (m && m.length === 2) {
					anchors.push({
						text: m[1],
						to: `?id=${toKebabCase(m[1])}`,
					});
				}
			}
			return anchors;
		}
	} catch (err) {
		throw err;
	}
};

const parseSchemaReference = async (text: string, slug: string, branch: string): Promise<string> => {
	try {
		const schema = await initializeSchema(branch);

		return text.replace(`!!SchemaReference!!`, (match: string) => {
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

		return text.replace(`!!SchemaReference!!`, (match: string) => {
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

		// Parse the things
		if (!!branch) {
			if (!!definition) {
				text = await parseSchemaDefinition(text, slug, branch, definition);
			} else {
				text = await parseSchemaReference(text, slug, branch);
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

export { parseCustomMarkdown, getPageAnchors, getSchemaReferencePaths, getSchemaPageAnchors };
