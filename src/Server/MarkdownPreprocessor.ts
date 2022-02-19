import { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { toPascalCase } from "Utility/TextCaseConversions";

const spacer = `\n\n<Spacer />\n\n`;

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
		allOf,
		$ref: reference,
		definitions: schemaDefinitions,
		if: schemaIf,
		then: schemaThen,
		else: schemaElse,
		additionalProperties,
		required,
	} = schema;

	// const cleanName = !!name ? name.replace(/^\^(.+?)\$$/g, "$1") : null;

	if (!!schemaDefinitions) {
		definitions = schemaDefinitions;

		/*result += Object.entries(schemaDefinitions)
			.map(([key, value]) => {
				if (value["type"] && value["type"] !== "object" && value["type"] !== undefined) return "";

				let displayName = definitionName.split("-").pop() ?? "";
				displayName = displayName.charAt(0).toUpperCase() + displayName.substring(1);
				return `<!-- ${displayName}:definition=${key} -->\n\n`;
			})
			.join("");*/
	}

	if (!!name) {
		result += `##### [${name}]\n\n`;
	}

	let isNotDefinition: boolean = false;

	if (!!reference) {
		let definitionName = reference.replace(/^#\/definitions\/(.+)$/g, "$1");
		const def = !!definitions && definitions[definitionName];
		isNotDefinition =
			!!definitions &&
			!!def &&
			(!def["type"] || (!!def["type"] && def["type"] !== "object" && def["type"] !== undefined));

		if (isNotDefinition) {
			result += jsonNodeToMarkdown(null, slug, definitions![definitionName] as JSONSchema7, definitions);
		} else {
			const displayName = toPascalCase(definitionName);
			result += `* type: [${displayName}](/${slug}/${definitionName})\n`;
		}
		return result;
	}

	if (!!type) {
		result += `* type: \`${type}\`\n`;
	}
	if (!!defaultValue) {
		if (typeof defaultValue === "string") {
			result += `* default: \`${defaultValue}\`\n`;
		} else if (typeof defaultValue === "string") {
			result += `* default:
\`\`\`json
${JSON.stringify(defaultValue, undefined, 3)}
\`\`\`  \n`;
		}
	}
	if (!!pattern) {
		result += `* pattern: \`\`${pattern.replace(/\\b/g, "\\\\b")}\`\`\n`;
	}
	if (!!uniqueItems) {
		result += `* unique items: \`${uniqueItems ? "true" : "false"}\`\n`;
	}
	if (!!minItems) {
		result += `* min items: \`${minItems}\`\n`;
	}
	if (!!maxItems) {
		result += `* max items: \`${maxItems}\`\n`;
	}
	if (!!enumValue) {
		result += `* enum: \`${enumValue.join("` `")}\`\n`;
	}
	if (!!examples && Array.isArray(examples)) {
		result += `* examples: \`${examples.join("` `")}\`\n`;
	}
	if (!!required) {
		result += `* required: \`${required.join("` `")}\`\n`;
	}
	if (!!description && description.length > 0) {
		result += `\n${description}\n\n`;
	}
	if (!!anyOf) {
		result +=
			`\n<IndentGroup label="any of">\n\n` +
			anyOf.map((value, i) => jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, true)).join("") +
			`\n</IndentGroup>\n\n`;
	}
	if (!!oneOf) {
		result +=
			`\n<IndentGroup label="one of">\n\n` +
			oneOf.map((value, i) => jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, true)).join("") +
			`\n</IndentGroup>\n\n`;
	}
	if (!!allOf) {
		result +=
			`\n<IndentGroup label="all of">\n\n` +
			allOf.map((value, i) => jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, true)).join("") +
			`\n</IndentGroup>\n\n`;
	}
	if (!!items) {
		result += `\n<IndentGroup label="items">\n\n`;
		if (Array.isArray(items)) {
			result += items
				.map((value, i) => jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, true))
				.join(spacer);
		} else if (typeof items === "object") {
			result += jsonNodeToMarkdown(null, slug, items as JSONSchema7, definitions);
		}
		result += `\n</IndentGroup>\n\n`;
	}

	if (!!schemaIf || !!schemaThen || !!schemaElse) {
		result += `\n<IndentGroup label="one of">\n\n`;

		let nextNode: JSONSchema7 | undefined = schema;
		while (nextNode !== undefined) {
			if (!!nextNode.then && typeof nextNode.then === "object") {
				result += jsonNodeToMarkdown(null, slug, nextNode.then as JSONSchema7, definitions);
			}
			if (!!nextNode.else && typeof nextNode.else === "object") {
				if (!!nextNode.else.$ref) {
					result += jsonNodeToMarkdown(null, slug, nextNode.else as JSONSchema7, definitions);
					nextNode = undefined;
				} else {
					nextNode = nextNode.else;
				}
			} else {
				nextNode = undefined;
			}
		}

		result += `\n</IndentGroup>\n\n`;
	}

	/*if (!!cleanName) {
		result += spacer;
	}*/

	if (!!additionalProperties && typeof additionalProperties === "boolean") {
		result += `additionalProperties: \`${additionalProperties ? "true" : "false"}\`  \n`;
	}
	if (!!properties) {
		result +=
			`\n<IndentGroup label="properties">\n\n` +
			Object.entries(properties)
				.map(([key, value], i) => jsonNodeToMarkdown(key, slug, value as JSONSchema7, definitions, indented))
				.join(spacer) +
			`\n</IndentGroup>\n\n`;
	}
	if (!!properties && !!patternProperties) {
		result += `\n\n<Spacer />\n\n`;
	}
	if (!!patternProperties) {
		result +=
			`\n<IndentGroup label="pattern properties">\n\n` +
			Object.entries(patternProperties)
				.map(([key, value], i) => {
					// let res: string = `##### [pattern${i + 1}]\n\n\`${key}\`\n\n`;
					let res: string = `\`\`${key.replace(/\\b/g, "\\\\b")}\`\`\n\n`;
					res += jsonNodeToMarkdown(null, slug, value as JSONSchema7, definitions, indented);
					return res;
				})
				.join(spacer) +
			`\n</IndentGroup>\n\n`;
	}

	return result;
};

export { jsonNodeToMarkdown };
