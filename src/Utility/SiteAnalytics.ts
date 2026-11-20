const useAnalyticsStub = () => {};

class AnalyticsStub {
	static trackDownload(_kind: string) {}
	static trackGithubReleaseClick(_ref: string) {}
	static trackFooter(_kind: string) {}
}

const SiteAnalytics = AnalyticsStub;
const useSiteAnalytics = useAnalyticsStub;

export { SiteAnalytics, useSiteAnalytics };
