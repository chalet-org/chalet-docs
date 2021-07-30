import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";

export const useRouterScroll = () => {
	const router = useRouter();

	const handler = useCallback(() => {
		if (window.location.search.length === 0) {
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 25);
		}
	}, []);

	useEffect(() => {
		router.events.on("routeChangeComplete", handler);

		return () => {
			router.events.off("routeChangeComplete", handler);
		};
	}, []);
};
