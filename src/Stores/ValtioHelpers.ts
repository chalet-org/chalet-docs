import { proxy, ref, subscribe } from "valtio";
import { useSnapshot } from "valtio/react";

function isObjectOrNull<T extends object>(obj: T) {
	return typeof obj === "object" && !Array.isArray(obj);
}

function withPersistenceBetweenSessions<T extends object>(cacheName: string | null, result: T) {
	if (typeof localStorage === "undefined" || !cacheName) {
		return proxy(result as T);
	}

	const cached = localStorage.getItem(cacheName);
	let outState: T;
	if (cached) {
		const tmp = JSON.parse(cached);
		for (const [key, value] of Object.entries(tmp)) {
			result[key] = value;
		}
	}
	outState = proxy(result as T);

	subscribe(outState, () => {
		localStorage.setItem(cacheName, JSON.stringify(outState));
	});

	return outState;
}

/**
 * Create a valtio proxy one level deep - do not proxy inner objects
 */
function shallowProxy<T extends object>(cacheName: string | null, state: T) {
	const result = {
		_refs: ref({}),
	};

	for (const [key, value] of Object.entries(state)) {
		if (isObjectOrNull(value)) {
			result._refs[key] = value;
			Object.defineProperty(result, key, {
				get() {
					return this._refs[key];
				},
				set(newValue: any) {
					if (newValue === null) {
						this._refs[key] = null;
					} else if (isObjectOrNull(newValue)) {
						this._refs[key] = ref(newValue);
					} else {
						this._refs[key] = newValue;
					}
				},
			});
		} else {
			result[key] = value;
		}
	}

	// return withPersistenceBetweenSessions(cacheName, result as T);

	return proxy(result as T);
}

function makeStore<T extends object>(self: T) {
	return {
		useStore: () => useSnapshot(self),
		getStore: () => self,
	};
}

export { shallowProxy, makeStore };
