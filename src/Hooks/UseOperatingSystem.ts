import platformJs from "platform";
import { useMemo } from "react";

export const enum OperatingSystem {
	Windows = "windows",
	MacOS = "macos",
	Linux = "linux",
}

export const enum PreferredCompiler {
	MSVC = "msvc",
	LLVM = "llvm",
	GCC = "gcc",
}

const useOperatingSystem = (): [OperatingSystem, PreferredCompiler] => {
	const platform: [OperatingSystem, PreferredCompiler] = useMemo(() => {
		const userAgentData = (navigator as any).userAgentData;
		if (userAgentData) {
			const pf = userAgentData.platform ?? "";
			if (pf === "Windows") {
				return [OperatingSystem.Windows, PreferredCompiler.MSVC];
			} else if (pf === "macOS" || pf === "iOS") {
				return [OperatingSystem.MacOS, PreferredCompiler.LLVM];
			}
		} else {
			const os = platformJs.os;
			if (os && os.family) {
				if (os.family.startsWith("Windows")) {
					return [OperatingSystem.Windows, PreferredCompiler.MSVC];
				} else if (os.family.startsWith("OS X") || os.family.startsWith("iOS")) {
					return [OperatingSystem.MacOS, PreferredCompiler.LLVM];
				}
			}
		}

		return [OperatingSystem.Linux, PreferredCompiler.GCC];
	}, []);

	return platform;
};

export { useOperatingSystem };
