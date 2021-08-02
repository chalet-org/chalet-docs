import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import React from "react";
import styled from "styled-components";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { AnchoredHeadingObject as AnchoredHeading, Code, CodePre, Link } from "Components";
import { hashString } from "Utility";
import { toKebabCase } from "Utility/TextCaseConversions";

type Props = {
	name: Optional<string>;
	schema: Optional<JSONSchema7>;
	definitions?: Dictionary<JSONSchema7Definition>;
};

const SchemaDocNode = ({ name, schema, definitions }: Props) => {
	if (!schema) return null;

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
	}

	const definitionName = !!reference ? reference.replace(/^#\/definitions\/(.+)$/g, "$1") : "";

	const resolveReference =
		!!definitions &&
		!!definitions[definitionName] &&
		!!definitions[definitionName]["type"] &&
		definitions[definitionName]["type"] !== "object" &&
		definitions[definitionName]["type"] !== undefined;

	let referenceId: string = "";
	let displayName: string = "";
	if (!resolveReference) {
		const split = definitionName.split("-");
		displayName = split[split.length - 1];
		displayName = displayName.charAt(0).toUpperCase() + displayName.substr(1);
		referenceId = toKebabCase(definitionName);
	}

	return (
		<Styles>
			{!!reference && (
				<>
					{resolveReference ? (
						<>
							<SchemaDocNode
								name={null}
								{...{
									definitions,
									schema: definitions![definitionName] as JSONSchema7,
								}}
							/>
						</>
					) : (
						<p>
							{cleanName}: <Link href={`/schema-reference/${referenceId}`}>{displayName}</Link>
						</p>
					)}
				</>
			)}
			{!!cleanName && !reference && <AnchoredHeading.AnchoredH4>{cleanName}</AnchoredHeading.AnchoredH4>}
			{!!type && (
				<p>
					type: <Code>{type}</Code>
				</p>
			)}
			{!!defaultValue && typeof defaultValue === "string" && (
				<p>
					default: <Code>{defaultValue}</Code>
				</p>
			)}
			{!!defaultValue && typeof defaultValue === "object" && (
				<>
					<p>default:</p>
					<CodePre lang="json">{JSON.stringify(defaultValue, undefined, 3)}</CodePre>
				</>
			)}
			{!!pattern && (
				<p>
					pattern: <Code>{pattern}</Code>
				</p>
			)}
			{!!enumValue && (
				<p>
					enum:
					{enumValue.map((enumVal, i) => (
						<React.Fragment key={i}>
							<Code>{enumVal}</Code>{" "}
						</React.Fragment>
					))}
				</p>
			)}
			{!!examples && Array.isArray(examples) && (
				<p>
					examples:{" "}
					{examples.map((example, i) => (
						<React.Fragment key={i}>
							<Code>{example}</Code>{" "}
						</React.Fragment>
					))}
				</p>
			)}
			{!!minItems && (
				<p>
					minItems: <Code>{minItems}</Code>
				</p>
			)}
			{!!maxItems && (
				<p>
					maxItems: <Code>{maxItems}</Code>
				</p>
			)}
			{!!description && <p>{description}</p>}
			{!!anyOf && (
				<>
					<p>anyOf:</p>
					{anyOf.map((value, i) => (
						<SchemaDocNode
							key={hashString(`ao-${cleanName}-${i}`)}
							{...{
								definitions,
								name: null,
								schema: value as JSONSchema7,
							}}
						/>
					))}
				</>
			)}
			{!!oneOf && (
				<>
					<p>oneOf:</p>
					{oneOf.map((value, i) => (
						<SchemaDocNode
							key={hashString(`oo-${cleanName}-${i}`)}
							{...{
								definitions,
								name: null,
								schema: value as JSONSchema7,
							}}
						/>
					))}
				</>
			)}
			{!!items && Array.isArray(items) && (
				<>
					<p>items:</p>
					{items.map((value, i) => (
						<SchemaDocNode
							key={hashString(`it-${cleanName}-${i}`)}
							{...{
								definitions,
								name: null,
								schema: value as JSONSchema7,
							}}
						/>
					))}
				</>
			)}
			{!!items && typeof items === "object" && (
				<>
					<p>items:</p>
					<SchemaDocNode
						key={hashString(`it-${cleanName}-0`)}
						{...{
							definitions,
							name: null,
							schema: items as JSONSchema7,
						}}
					/>
				</>
			)}
			{!!cleanName && !reference && <br />}
			{!!properties && (
				<>
					<p>properties:</p>
					{Object.entries(properties).map(([key, value], i) => {
						return (
							<SchemaDocNode
								key={hashString(`p-${cleanName}-${i}`)}
								{...{
									definitions,
									name: key,
									schema: value as JSONSchema7,
								}}
							/>
						);
					})}
				</>
			)}
			{!!patternProperties && (
				<>
					<p>patternProperties:</p>
					{Object.entries(patternProperties).map(([key, value], i) => {
						return (
							<SchemaDocNode
								key={hashString(`pp-${cleanName}-${i}`)}
								{...{
									definitions,
									name: key,
									schema: value as JSONSchema7,
								}}
							/>
						);
					})}
				</>
			)}
		</Styles>
	);
};

const Styles = styled.div`
	display: block;
`;

export { SchemaDocNode };
