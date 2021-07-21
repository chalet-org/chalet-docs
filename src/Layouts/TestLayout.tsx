import React from "react";
import styled from "styled-components";

import { ChaletSchema } from "Api";
import { Code, Page, SchemaDocNode } from "Components";
import { useUiStore } from "Stores";
import { CodeTheme, PageTheme } from "Theme";

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
	const { setTheme } = useUiStore();
	return (
		<Page title="Sandbox for all of the things">
			<Styles>
				Main
				<br />
				<button onClick={() => setTheme(PageTheme.Dark, CodeTheme.Dark)}>Dark</button>
				<button onClick={() => setTheme(PageTheme.Light, CodeTheme.Light)}>Light</button>
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
