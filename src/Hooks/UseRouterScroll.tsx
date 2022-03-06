import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";

import { Optional } from "@rewrking/react-kitchen";

import { useUiStore } from "Stores";
import { getQueryVariable } from "Utility/GetQueryVariable";

const useRouteChangeScroll = () => {
	const router = useRouter();

	const { setFocusedId } = useUiStore();

	const handler = useCallback(() => {
		if (window.location.search.length === 0) {
			setFocusedId("");
			setTimeout(() => {
				const mainEl = document.getElementById("main");
				mainEl?.scrollTo(0, 0);
			}, 25);
		} else {
			const id = getQueryVariable("id");
			if (id.length > 0) {
				const el: Optional<HTMLElement> = document.getElementById(id);
				const top: Optional<number> = el?.offsetTop ?? null;
				const mainEl = document.getElementById("main");
				if (!!top && !!mainEl) {
					mainEl.scrollTo({ behavior: "smooth", top });
				}
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
