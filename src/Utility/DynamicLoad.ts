import { default as nextDynamic } from "next/dynamic";

type Components = "Code" | "Link" | "BlockQuote";

export const dynamic = {
	component: (component: Components) => nextDynamic(async () => (await import("Components"))[component] as any),
};
