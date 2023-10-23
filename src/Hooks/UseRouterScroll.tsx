import { useRouter } from "next/router";
import { useEffect, useCallback, useState } from "react";

import { useUiStore } from "Stores";
import { Optional } from "Utility";
import { getQueryVariable } from "Utility/GetQueryVariable";

const useRouteChangeScroll = () => {
	const router = useRouter();
	const [lastEl, setLastEl] = useState<Optional<HTMLElement>>(null);

	const { setFocusedId, findText } = useUiStore();

	const handler = useCallback(() => {
		const mainEl = document.getElementById("main");
		if (!!mainEl && findText.length > 0) {
			const split = findText.split("'");
			let queryText: string;
			if (split.length > 1) queryText = `concat('${split.join("', \"'\", '")}')`;
			else queryText = `'${findText}'`;
			const xpathQuery = `//*[@id='main']//*[text()[contains(normalize-space(.), ${queryText})]]`;
			try {
				const node = document.evaluate(
					xpathQuery,
					document,
					null,
					XPathResult.FIRST_ORDERED_NODE_TYPE,
					null
				).singleNodeValue;
				// console.log(node, xpathQuery);
				if (node) {
					const element = node as HTMLElement;
					const top: number = element?.offsetTop ?? null;
					if (!!top) {
						mainEl.scrollTo({ behavior: "smooth", top });
						element!.classList.add("focused-element");
						setLastEl(element);
					} else {
						setLastEl((prev) => {
							prev?.classList.remove("focused-element");
							return null;
						});
					}
				} else {
					setLastEl((prev) => {
						prev?.classList.remove("focused-element");
						return null;
					});
				}
			} catch (err: any) {
				console.warn(err.message);
			}
		} else if (window.location.search.length === 0) {
			setFocusedId(router.asPath);
			setLastEl(null);
			setTimeout(() => {
				const mainEl = document.getElementById("main");
				mainEl?.scrollTo(0, 0);
			}, 25);
		} else {
			const id = getQueryVariable("id");
			if (id.length > 0) {
				setTimeout(() => {
					const el: Optional<HTMLElement> = document.getElementById(id);
					const top: Optional<number> = el?.offsetTop ?? null;
					const mainEl = document.getElementById("main");
					if (!!top && !!mainEl) {
						mainEl.scrollTo({ behavior: "smooth", top });
					}
					setLastEl(null);
				}, 50);
			}
		}
	}, [router.asPath, findText]);

	useEffect(() => {
		router.events.on("routeChangeComplete", handler);

		handler();

		return () => {
			router.events.off("routeChangeComplete", handler);
		};
	}, [handler]);
};

export { useRouteChangeScroll };
