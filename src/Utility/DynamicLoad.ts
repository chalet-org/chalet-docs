import { default as nextDynamic } from "next/dynamic";

type Components =
	| "Accordion"
	| "BlockQuote"
	| "ButtonLink"
	| "Code"
	| "CodePre"
	| "CodeHeader"
	| "CodePreFromMarkdown"
	| "ContactForm"
	| "ImportantNote"
	| "InlineImage"
	| "IndentGroup"
	| "Link"
	| "NotFoundTerminal"
	| "OrderedList"
	| "PageDescription"
	| "PageCategory"
	| "PageHeading"
	| "PageNavigation"
	| "Paragraph"
	| "Spacer"
	| "Stub"
	| "TabbedContent"
	| "Tagline"
	| "TermDemo"
	| "UnorderedList"
	| "UnorderedListSchema";

export const dynamic = {
	component: (component: Components) =>
		nextDynamic(async () => {
			const cmp = (await import("Components"))[component] as any;
			if (cmp === undefined) {
				throw new Error(`Component "${component}" was not found for dynamic import`);
			}
			return cmp;
		}),
};
