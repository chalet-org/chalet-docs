import { default as nextDynamic } from "next/dynamic";

type Components = "Code" | "CodePre" | "Link" | "BlockQuote" | "ThemeToggle";

export const dynamic = {
	component: (component: Components) => nextDynamic(async () => (await import("Components"))[component] as any),
};
