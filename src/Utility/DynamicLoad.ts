import { default as nextDynamic } from "next/dynamic";

type Components = "Code" | "CodePre" | "CodePreFromMarkdown" | "Link" | "BlockQuote" | "ThemeToggle" | "Stub";

export const dynamic = {
	component: (component: Components) => nextDynamic(async () => (await import("Components"))[component] as any),
};
