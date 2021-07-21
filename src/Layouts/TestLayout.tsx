import React from "react";
import styled from "styled-components";

import { ChaletSchema } from "Api";
import { Code, Page, SchemaDocNode } from "Components";

type Props = ChaletSchema;

const cppText = `void myFunction() {
    MyClass inst;
    inst.thing = 4;
    inst.doThing();
}`;

const jsonText = `{
    "key": "value",
    "isTrue": true,
    "index": 1
}`;

const TestLayout = ({ schema }: Props) => {
	return (
		<Page title="Sandbox for all of the things">
			<Styles>
				Main
				<br />
				<br />
				<Code language="cpp" text={cppText} />
				<Code language="json" text={jsonText} />
				<h2>Schema Reference</h2>
				<Code language="json" text={JSON.stringify(schema, undefined, 4)} />
				<SchemaDocNode name="root" schema={schema} />
			</Styles>
		</Page>
	);
};

export { TestLayout };

const Styles = styled.div`
	white-space: pre-wrap;
`;
