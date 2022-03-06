import React from "react";

import { AnchoredHeadingObject, PageDescription, SchemaPageControls } from "Components";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";

const SchemaPageLayout = (props: Props) => {
	const { schemaLinks, anchors } = props;
	const Header = AnchoredHeadingObject["AnchoredH1"];
	return (
		<MarkdownLayout {...props}>
			<Header>Schema Reference</Header>
			<hr />
			<PageDescription>Explore the JSON schema for a given Chalet file type.</PageDescription>
			{!!schemaLinks && <SchemaPageControls schemaLinks={schemaLinks} anchors={anchors} />}
		</MarkdownLayout>
	);
};

export { SchemaPageLayout };
