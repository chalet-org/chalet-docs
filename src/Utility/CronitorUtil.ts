import { useRouter } from "next/router";
import { useEffect } from "react";

import * as CronitorImpl from "@cronitorio/cronitor-rum-js";

import { isDevelopment } from "Server/IsDevelopment";

const CLIENT_ID: string = process.env.NEXT_PUBLIC_CRONITOR_CLIENT_ID ?? "";

const config: CronitorImpl.CronitorRUMConfig = {
	debug: isDevelopment,
	enabled: !isDevelopment,
	// debug: false,
	// enabled: true,
	honorDNT: false,
};
const canUseCronitor: boolean = (config.enabled ?? true) && CLIENT_ID.length > 0;

const trackPageView = (route?: string) => {
	console.log("Cronitor.trackPageView:", route ?? "any");
	CronitorImpl.track(route ?? "Pageview");
};

const handleRouteChange = () => trackPageView();

const useCronitor = () => {
	const router = useRouter();

	useEffect(() => {
		console.log("canUseCronitor:", canUseCronitor);
		if (canUseCronitor) {
			console.log("loading Cronitor...");
			console.log("config:", config);
			CronitorImpl.load(CLIENT_ID, config);
			trackPageView();

			router.events.on("routeChangeComplete", handleRouteChange);
		}

		return () => {
			if (canUseCronitor) {
				router.events.off("routeChangeComplete", handleRouteChange);
			}
		};
	}, []);
};

class Cronitor {
	static trackDownload(kind: string) {
		console.log("Cronitor.trackDownload:", kind);
		CronitorImpl.track(`Click.Download.${kind}`);
	}

	static trackGithubReleaseClick(ref: string) {
		console.log("Cronitor.trackGithubReleaseClick:", ref);
		CronitorImpl.track(`Click.GithubReleaseLink.${ref}`);
	}

	static trackGithubClick() {
		console.log("Cronitor.trackGithubClick");
		CronitorImpl.track(`Click.GithubLink`);
	}
}

export { Cronitor, useCronitor };
