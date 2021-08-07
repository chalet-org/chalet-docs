import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";

import { Optional } from "@andrew-r-king/react-kitchen";

import { getQueryVariable } from "Utility/GetQueryVariable";

export const useRouterScroll = () => {
	const router = useRouter();

	const handler = useCallback(() => {
		if (window.location.search.length === 0) {
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 25);
		} else {
			const id = getQueryVariable("id");
			if (id.length > 0) {
				const el: Optional<HTMLElement> = document.getElementById(id);
				const top: Optional<number> = el?.offsetTop ?? null;
				if (!!top) {
					window.scrollTo({ behavior: "smooth", top });
				}
			}
		}
	}, []);

	useEffect(() => {
		router.events.on("routeChangeComplete", handler);

		return () => {
			router.events.off("routeChangeComplete", handler);
		};
	}, []);
};
