import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { AnchoredHeadingObject, PageDescription, SchemaPageControls } from "Components";
import { schemaComponents } from "Components/MarkdownComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { useUiStore } from "Stores";

const SchemaPageLayout = (props: Props) => {
	const { schemaLinks, anchors } = props;
	const { setFocusedId } = useUiStore();
	const router = useRouter();

	const Header = AnchoredHeadingObject["AnchoredH1"];
	return (
		<MarkdownLayout {...props} components={schemaComponents} trackScrolling={false}>
			<Header>Schema Reference</Header>
			<hr />
			<PageDescription>Explore the JSON schema for a given Chalet file type.</PageDescription>
			{!!schemaLinks && <SchemaPageControls schemaLinks={schemaLinks} anchors={anchors} />}
		</MarkdownLayout>
	);
};

export { SchemaPageLayout };
