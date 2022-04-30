import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";

import { Optional } from "@rewrking/react-kitchen";

import { getUiStore, useUiStore } from "Stores";
import { getQueryVariable } from "Utility/GetQueryVariable";

const useRouteChangeScroll = () => {
	const router = useRouter();

	const { setFocusedId } = useUiStore();

	const handler = useCallback(() => {
		const mainEl = document.getElementById("main");
		const { findText } = getUiStore();
		if (!!mainEl && findText.length > 0) {
			const split = findText.split("'");
			let queryText: string;
			if (split.length > 1) queryText = `concat('${split.join("', \"'\", '")}')`;
			else queryText = `'${findText}'`;
			const xpathQuery = `//*[@id='main']//*[contains(text(), ${queryText})]`;
			// const node = xpath.fromPageSource(mainEl.innerHTML).findElement(xpathQuery);
			try {
				const node = document.evaluate(
					xpathQuery,
					document,
					null,
					XPathResult.FIRST_ORDERED_NODE_TYPE,
					null
				).singleNodeValue;
				if (node) {
					const top: number = (node as HTMLElement)?.offsetTop ?? null;
					if (!!top) {
						mainEl.scrollTo({ behavior: "smooth", top });
					}
				}
			} catch (err: any) {
				console.warn(err.message);
			}
			// resetFindText();
		} else if (window.location.search.length === 0) {
			setFocusedId(router.asPath);
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
				}, 50);
			}
		}
	}, [router.asPath]);

	useEffect(() => {
		router.events.on("routeChangeComplete", handler);

		handler();

		return () => {
			router.events.off("routeChangeComplete", handler);
		};
	}, [handler]);
};

export { useRouteChangeScroll };
