import platformJs from "platform";
import { useMemo } from "react";

export enum OperatingSystem {
	Windows = "windows",
	MacOS = "macos",
	Linux = "linux",
}

export enum PreferredCompiler {
	MSVC = "msvc",
	LLVM = "llvm",
	GCC = "gcc",
}

const useOperatingSystem = (): [OperatingSystem, PreferredCompiler] => {
	const platform: [OperatingSystem, PreferredCompiler] = useMemo(() => {
		const platform = platformJs.os;
		if (platform && platform.family) {
			if (platform.family.startsWith("Windows")) {
				return [OperatingSystem.Windows, PreferredCompiler.MSVC];
			} else if (platform.family.startsWith("OS X") || platform.family.startsWith("iOS")) {
				return [OperatingSystem.MacOS, PreferredCompiler.LLVM];
			}
		}

		return [OperatingSystem.Linux, PreferredCompiler.GCC];
	}, []);

	return platform;
};

export { useOperatingSystem };
