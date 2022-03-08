import platformJs from "platform";

import { OperatingSystem } from "Hooks/UseOperatingSystem";

const getOperatingSystem = (): OperatingSystem => {
	const os = platformJs.os;
	if (os && os.family) {
		if (os.family.startsWith("Windows")) {
			return OperatingSystem.Windows;
		} else if (os.family.startsWith("OS X") || os.family.startsWith("iOS")) {
			return OperatingSystem.MacOS;
		}
	}

	return OperatingSystem.Linux;
};

export { getOperatingSystem };
