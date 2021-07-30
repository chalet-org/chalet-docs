import React from "react";

import { ResultChaletSchema } from "Server/ResultTypes";

import { CodePre } from "./Code";
import { SchemaDocNode } from "./SchemaDocNode";

type Props = ResultChaletSchema;

const SchemaTest = ({ schema }: Props) => {
	return !!schema ? (
		<>
			{/* <CodePre lang="json">{JSON.stringify(schema, undefined, 2)}</CodePre> */}
			{/* <SchemaDocNode name="$root" schema={schema} /> */}
		</>
	) : null;
};

export { SchemaTest };
