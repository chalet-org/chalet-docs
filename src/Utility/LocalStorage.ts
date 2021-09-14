class LocalStorage {
	private static storage = (): Storage => {
		if (typeof window === "undefined") {
			throw new Error("window is not defined");
		}
		return window.localStorage;
	};

	static windowAvailable = (): boolean => {
		return typeof window !== "undefined";
	};

	static get = <Value extends string = string>(key: string, defaultValue: Value): Value => {
		const item = LocalStorage.storage().getItem(key);
		if (item === null) {
			// console.log(`item '${key}' is: null`);
			LocalStorage.set(key, defaultValue);
			return defaultValue;
		}

		// console.log(`item '${key}' is: ${item}`);
		return item as Value;
	};

	static set = <Value extends string = string>(key: string, value: Value): boolean => {
		try {
			LocalStorage.storage().setItem(key, value);
			return true;
		} catch (err: any) {
			console.error(err.message);
			return false;
		}
	};

	static remove = (key: string) => {
		LocalStorage.storage().removeItem(key);
	};

	static removeAllOf = (keys: string[]) => {
		keys.forEach((key) => LocalStorage.remove(key));
	};
}

export { LocalStorage };
