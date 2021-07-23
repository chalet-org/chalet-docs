import { default as nextDynamic } from "next/dynamic";

type Components = "Code" | "Link";

export const dynamic = {
	component: (component: Components) => nextDynamic(async () => (await import("Components"))[component] as any),
};
