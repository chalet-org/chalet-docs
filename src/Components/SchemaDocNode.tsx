import { JSONSchema7 } from "json-schema";
import React from "react";
import styled from "styled-components";

import { hashString } from "Utility";

type Props = {
	name: string;
	schema: JSONSchema7;
};

const SchemaDocNode = ({ name, schema }: Props) => {
	const { type, description, properties, patternProperties } = schema;
	return (
		<Styles>
			<h4>{name}</h4>
			{!!type && <div>type: {type}</div>}
			{!!description && <div>{description}</div>}{" "}
			{!!properties &&
				Object.entries(properties).map(([key, value], i) => {
					return (
						<SchemaDocNode key={hashString(`p-${name}-${i}`)} name={key} schema={value as JSONSchema7} />
					);
				})}
			{!!patternProperties &&
				Object.entries(patternProperties).map(([key, value], i) => {
					return (
						<SchemaDocNode key={hashString(`pp-${name}-${i}`)} name={key} schema={value as JSONSchema7} />
					);
				})}
		</Styles>
	);
};

const Styles = styled.div`
	display: block;
`;

export { SchemaDocNode };
