import { default as nextDynamic } from "next/dynamic";

type Components =
	| "Accordion"
	| "BlockQuote"
	| "Code"
	| "CodePre"
	| "CodeHeader"
	| "CodePreFromMarkdown"
	| "IndentGroup"
	| "Link"
	| "OrderedList"
	| "PageHeading"
	| "PageNavigation"
	| "Paragraph"
	| "Spacer"
	| "Stub"
	| "TabbedContent"
	| "UnorderedList";

export const dynamic = {
	component: (component: Components) => nextDynamic(async () => (await import("Components"))[component] as any),
};
