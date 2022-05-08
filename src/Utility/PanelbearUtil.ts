import { useRouter } from "next/router";
import { useEffect } from "react";

import * as PanelbearImpl from "@panelbear/panelbear-js";

import { isDevelopment } from "Server/IsDevelopment";

const PANELBEAR_ID: string = process.env.NEXT_PUBLIC_PANELBEAR_ID ?? "";

const config: PanelbearImpl.PanelbearConfig = {
	debug: isDevelopment,
	enabled: !isDevelopment,
	honorDNT: false,
};
const canUsePanelbear: boolean = (config.enabled ?? true) && PANELBEAR_ID.length > 0;

const handleRouteChange = () => PanelbearImpl.trackPageview();

const usePanelbear = () => {
	const router = useRouter();

	useEffect(() => {
		if (canUsePanelbear) {
			PanelbearImpl.load(PANELBEAR_ID, config);
			PanelbearImpl.trackPageview();

			router.events.on("routeChangeComplete", handleRouteChange);
		}

		return () => {
			if (canUsePanelbear) {
				router.events.off("routeChangeComplete", handleRouteChange);
			}
		};
	}, []);
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
