import React from "react";
import styled from "styled-components";

import { CodePre, Page, SchemaDocNode } from "Components";
import { ResultChaletSchema } from "Server/ResultTypes";

type Props = ResultChaletSchema;

const TestLayout = ({ schema, ...props }: Props) => {
	return (
		<Page title="Sandbox for all of the things">
			<Styles>
				<h1>Home</h1>
				<br />
				<h3>Schema Reference</h3>

				{!!schema && (
					<>
						<CodePre lang="json">{JSON.stringify(schema, undefined, 2)}</CodePre>
						<SchemaDocNode name="$root" schema={schema} />
					</>
				)}
			</Styles>
		</Page>
	);
};

export { TestLayout };

const Styles = styled.div`
	white-space: pre-wrap;
`;
