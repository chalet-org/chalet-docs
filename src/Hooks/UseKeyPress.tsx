import React, { useCallback, useEffect } from "react";

const useKeyPress = (inCallback: (ev: KeyboardEvent) => void, dependencies: React.DependencyList = []) => {
	const callback = useCallback(inCallback, dependencies);

	useEffect(() => {
		document.addEventListener("keydown", callback, false);

		return () => {
			document.removeEventListener("keydown", callback, false);
		};
	}, [callback]);

	return callback;
};

export { useKeyPress };
