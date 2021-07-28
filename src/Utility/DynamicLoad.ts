import { default as nextDynamic } from "next/dynamic";

type Components =
	| "BlockQuote"
	| "Code"
	| "CodePre"
	| "CodePreFromMarkdown"
	| "Link"
	| "PageHeading"
	| "Paragraph"
	| "Stub";

export const dynamic = {
	component: (component: Components) => nextDynamic(async () => (await import("Components"))[component] as any),
};
