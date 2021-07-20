import React from "react";
import styled from "styled-components";
import { JSONSchema7 } from "json-schema";

type Props = {
	name: string;
	schema: JSONSchema7;
};

const SchemaDocNode = ({ name, schema }: Props) => {
	const { type, description, properties, patternProperties } = schema;
	return (
		<Styles>
			<div>{name}</div>
			{!!type && <div>type: {type}</div>}
			{!!description && <div>{description}</div>}{" "}
			{!!properties &&
				Object.entries(properties).map(([key, value]) => {
					return <SchemaDocNode name={key} schema={value as JSONSchema7} />;
				})}
			{!!patternProperties &&
				Object.entries(patternProperties).map(([key, value]) => {
					return <SchemaDocNode name={key} schema={value as JSONSchema7} />;
				})}
		</Styles>
	);
};

const Styles = styled.div`
	display: block;
`;

export { SchemaDocNode };
