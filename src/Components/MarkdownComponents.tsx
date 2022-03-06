import { MDXRemoteProps } from "next-mdx-remote";

import { Dictionary } from "@rewrking/react-kitchen";

import { dynamic } from "Utility";

import { AnchoredHeadingObject, HeadingObject } from "./Heading";

type MDXComponents = Dictionary<React.ComponentType<any>>;

const mdxComponents: MDXComponents = {
	...AnchoredHeadingObject,
	...HeadingObject,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	ul: dynamic.component("UnorderedList"),
	ol: dynamic.component("OrderedList"),
	inlineCode: dynamic.component("Code"),
	code: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
	Accordion: dynamic.component("Accordion"),
	IndentGroup: dynamic.component("IndentGroup"),
	PageHeading: dynamic.component("PageHeading"),
	PageNavigation: dynamic.component("PageNavigation"),
	TabbedContent: dynamic.component("TabbedContent"),
	Spacer: dynamic.component("Spacer"),
	CodeHeader: dynamic.component("CodeHeader"),
	PageDescription: dynamic.component("PageDescription"),
};

const schemaComponents: MDXComponents = {
	...mdxComponents,
	ul: dynamic.component("UnorderedListSchema"),
};

export { mdxComponents, schemaComponents };
