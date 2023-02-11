import { useRouter } from "next/router";
import { useEffect } from "react";

import * as CronitorImpl from "@cronitorio/cronitor-rum-js";

import { isDevelopment } from "Server/IsDevelopment";

const CLIENT_ID: string = process.env.NEXT_PUBLIC_CRONITOR_CLIENT_ID ?? "";

const config: CronitorImpl.CronitorRUMConfig = {
	debug: isDevelopment,
	enabled: !isDevelopment,
	honorDNT: false,
};
const canUseCronitor: boolean = (config.enabled ?? true) && CLIENT_ID.length > 0;

const trackPageView = (route?: string) => {
	CronitorImpl.track(route ?? "Pageview");
};

const handleRouteChange = () => trackPageView();

const useCronitor = () => {
	const router = useRouter();

	useEffect(() => {
		if (canUseCronitor) {
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
		CronitorImpl.track(`Click.Download.${kind}`);
	}

	static trackGithubReleaseClick(ref: string) {
		CronitorImpl.track(`Click.GithubReleaseLink.${ref}`);
	}

	static trackGithubClick() {
		CronitorImpl.track(`Click.GithubLink`);
	}
}

export { Cronitor, useCronitor };
