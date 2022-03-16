import platformJs from "platform";

import { OperatingSystem } from "Hooks/UseOperatingSystem";

const getOperatingSystem = (): OperatingSystem => {
	const userAgentData = (navigator as any).userAgentData;
	if (userAgentData) {
		const platform = userAgentData.platform ?? "";
		if (platform === "Windows") {
			return OperatingSystem.Windows;
		} else if (platform === "macOS" || platform === "iOS") {
			return OperatingSystem.MacOS;
		}
	} else {
		const os = platformJs.os;
		if (os && os.family) {
			if (os.family.startsWith("Windows")) {
				return OperatingSystem.Windows;
			} else if (os.family.startsWith("OS X") || os.family.startsWith("iOS")) {
				return OperatingSystem.MacOS;
			}
		}
	}

	return OperatingSystem.Linux;
};

export { getOperatingSystem };
