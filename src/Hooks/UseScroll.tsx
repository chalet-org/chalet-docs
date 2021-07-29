import React, { useCallback, useEffect } from "react";

const useScroll = (inCallback: (ev: Event) => void, dependencies: React.DependencyList = []) => {
	const callback = useCallback(inCallback, dependencies);

	useEffect(() => {
		document.addEventListener("scroll", callback, false);

		return () => {
			document.removeEventListener("scroll", callback, false);
		};
	}, [callback]);

	return callback;
};

const useWheelScroll = (inCallback: (ev: MouseEvent) => void, dependencies: React.DependencyList = []) => {
	const callback = useCallback(inCallback, dependencies);

	useEffect(() => {
		document.addEventListener("wheel", callback, false);

		return () => {
			document.removeEventListener("wheel", callback, false);
		};
	}, [callback]);

	return callback;
};

export { useScroll, useWheelScroll };
