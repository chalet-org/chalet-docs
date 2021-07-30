import { JSONSchema7 } from "json-schema";
import os from "os";

import { Optional } from "@andrew-r-king/react-kitchen";

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
	return text.replace(/(#{1,6}) \[(.+)\]/g, (match: string, p1: string, p2: string) => {
		return `<AnchoredH${p1.length}>${p2}</AnchoredH${p1.length}>`;
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

const parseJsonNodeToMarkdown = (name: string, schema: Optional<JSONSchema7>): string => {
	let result: string = "";
	if (!schema) return result;

	const { type, description, properties, patternProperties, default: defaultValue } = schema;

	const cleanName = name
		.replace(/\^(.+?)[\(\:].+?\$/g, (_: string, p1: string) => {
			return p1;
		})
		.replace(/\^\[.+?\$/g, "$any");

	if (!nameCache[cleanName]) {
		nameCache[cleanName] = true;

		result += `\n\n#### [${cleanName}]\n\n`;
		if (!!type) {
			result += `type: \`${type}\`\n\n`;
		}
		if (!!defaultValue) {
			result += `default: \`${defaultValue}\`\n\n`;
		}
		if (!!description) {
			result += `> ${description.replace(/\n/g, "\n> ")}\n\n`;
		}
		result += "<br />\n\n";
	}

	if (!!properties) {
		result += Object.entries(properties)
			.map(([key, value], i) => parseJsonNodeToMarkdown(key, value as JSONSchema7))
			.join("");
	}
	if (!!patternProperties) {
		result += Object.entries(patternProperties)
			.map(([key, value], i) => parseJsonNodeToMarkdown(key, value as JSONSchema7))
			.join("");
	}

	return result;
};

let otherData: Optional<object> = null;

const parseSchemaReference = async (text: string): Promise<string> => {
	try {
		if (!otherData) {
			otherData = {};

			const { schema } = await getChaletSchema();
			otherData["schema"] = schema;
		}
		nameCache = {};
		return text.replace(/\!\!SchemaReference:(\w+)\!\!/g, (match: string, p1: string) => {
			return parseJsonNodeToMarkdown("$root", otherData?.["schema"] ?? null);
		});
	} catch (err) {
		throw err;
	}
};

const parseCustomMarkdown = async (text: string): Promise<string> => {
	try {
		// First, ensure consistent line endings to make regex patterns easier
		text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

		// Parse the things
		text = await parseSchemaReference(text);
		text = parseImportantNotes(text);
		text = parsePageHeaders(text);
		text = parseAnchoredHeaders(text);
		text = parseTabs(text);

		// Set line endings back
		text = text.replace(/\n/g, os.EOL);

		return text;
	} catch (err) {
		throw err;
	}
};

export { parseCustomMarkdown };
