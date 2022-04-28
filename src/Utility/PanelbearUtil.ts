import { useRouter } from "next/router";
import { useEffect } from "react";

import * as PanelbearImpl from "@panelbear/panelbear-js";

import { isDevelopment } from "Server/IsDevelopment";

const config: PanelbearImpl.PanelbearConfig = {
	debug: isDevelopment,
	enabled: !isDevelopment,
};

const handleRouteChange = () => PanelbearImpl.trackPageview();

const usePanelbear = (site: string) => {
	const router = useRouter();

	useEffect(() => {
		if (config.enabled ?? true) {
			PanelbearImpl.load(site, config);
			PanelbearImpl.trackPageview();

			router.events.on("routeChangeComplete", handleRouteChange);
		}

		return () => {
			if (config.enabled ?? true) {
				router.events.off("routeChangeComplete", handleRouteChange);
			}
		};
	}, [site]);
};

class Panelbear {
	static trackDownload(kind: string) {
		PanelbearImpl.track(`Click.Download.${kind}`);
	}

	static trackGithubReleaseClick(ref: string) {
		PanelbearImpl.track(`Click.GithubReleaseLink.${ref}`);
	}

	static trackGithubClick() {
		PanelbearImpl.track(`Click.GithubLink`);
	}
}

export { Panelbear, usePanelbear };
