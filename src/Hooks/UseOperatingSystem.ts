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
		const os = platformJs.os;
		if (os && os.family) {
			if (os.family.startsWith("Windows")) {
				return [OperatingSystem.Windows, PreferredCompiler.MSVC];
			} else if (os.family.startsWith("OS X") || os.family.startsWith("iOS")) {
				return [OperatingSystem.MacOS, PreferredCompiler.LLVM];
			}
		}

		return [OperatingSystem.Linux, PreferredCompiler.GCC];
	}, []);

	return platform;
};

export { useOperatingSystem };
