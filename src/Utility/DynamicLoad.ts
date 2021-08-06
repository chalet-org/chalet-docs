import { default as nextDynamic } from "next/dynamic";

type Components =
	| "Accordion"
	| "BlockQuote"
	| "Code"
	| "CodePre"
	| "CodePreFromMarkdown"
	| "IndentGroup"
	| "Link"
	| "PageHeading"
	| "Paragraph"
	| "Spacer"
	| "Stub"
	| "TabbedContent"
	| "UnorderedList";

export const dynamic = {
	component: (component: Components) => nextDynamic(async () => (await import("Components"))[component] as any),
};
