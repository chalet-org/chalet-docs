import { dynamic } from "Utility";

import { AnchoredHeadingObject, HeadingObject } from "./Heading";

const mdxComponents = {
	...AnchoredHeadingObject,
	...HeadingObject,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	ul: dynamic.component("UnorderedList"),
	ol: dynamic.component("OrderedList"),
	img: dynamic.component("InlineImage"),
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
	PageCategory: dynamic.component("PageCategory"),
	TermDemo: dynamic.component("TermDemo"),
	Tagline: dynamic.component("Tagline"),
	ContactForm: dynamic.component("ContactForm"),
	NotFoundTerminal: dynamic.component("NotFoundTerminal"),
	ButtonLink: dynamic.component("ButtonLink"),
	ImportantNote: dynamic.component("ImportantNote"),
	Code: dynamic.component("CodePreFromMarkdown"),
};

export type MDXComponents = typeof mdxComponents;

const schemaComponents: MDXComponents = {
	...mdxComponents,
	ul: dynamic.component("UnorderedListSchema"),
};

export { mdxComponents, schemaComponents };
