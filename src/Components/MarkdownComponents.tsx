import { Dictionary } from "@andrew-r-king/react-kitchen";

import { dynamic } from "Utility";

import { AnchoredHeadingObject, HeadingObject } from "./Heading";

const mdxComponents: Dictionary<React.ComponentType<any>> = {
	...AnchoredHeadingObject,
	...HeadingObject,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	ul: dynamic.component("UnorderedList"),
	ol: dynamic.component("OrderedList"),
	inlineCode: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
	Accordion: dynamic.component("Accordion"),
	IndentGroup: dynamic.component("IndentGroup"),
	PageHeading: dynamic.component("PageHeading"),
	PageNavigation: dynamic.component("PageNavigation"),
	TabbedContent: dynamic.component("TabbedContent"),
	Spacer: dynamic.component("Spacer"),
	CodeHeader: dynamic.component("CodeHeader"),
};

const schemaComponents: Dictionary<React.ComponentType<any>> = {
	...mdxComponents,
	ul: dynamic.component("UnorderedListSchema"),
};

export { mdxComponents, schemaComponents };
