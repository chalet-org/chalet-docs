"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AutoRefreshDev = ({ children }) => {
	const router = useRouter();

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:3201");
		ws.onmessage = (event) => {
			if (event.data === "refresh") {
				router.refresh();
			}
		};
		return () => {
			ws.close();
		};
	}, [router]);

	return children;
};

export { AutoRefreshDev };
