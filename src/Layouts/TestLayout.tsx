import React from "react";
import styled from "styled-components";

import { ChaletSchema } from "Api";
import { Code, NavProps, Page, SchemaDocNode } from "Components";

type Props = NavProps & ChaletSchema;

const TestLayout = ({ schema, ...navProps }: Props) => {
	return (
		<Page title="Sandbox for all of the things" {...navProps}>
			<Styles>
				Main
				<br />
				<h2>Schema Reference</h2>
				{/* <Code lang="json" text={JSON.stringify(schema, undefined, 4)} /> */}
				<SchemaDocNode name="$root" schema={schema} />
			</Styles>
		</Page>
	);
};

export { TestLayout };

const Styles = styled.div`
	white-space: pre-wrap;
`;
