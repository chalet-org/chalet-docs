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

export { useScroll };
