import { performance } from "perf_hooks";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { isDevelopment } from "./IsDevelopment";

type CacheEntry<T> = {
	data: T;
	cacheLength: number;
	cachedAt: number;
};

let memoryCache: Dictionary<CacheEntry<any>> = {};

class ServerCache {
	private development: boolean = isDevelopment;
	private cacheSeconds: number = 15;

	constructor() {
		this.development = false;

		const hours = 4;
		this.cacheSeconds = 60 * 60 * hours;
	}

	get = async <T>(key: string, onCache: () => Promise<T>, cacheLength?: number): Promise<T> => {
		const startTime = performance.now();
		const response = memoryCache[key] ?? null;
		cacheLength = cacheLength ?? this.cacheSeconds;

		const currentTime = new Date().getTime() / 1000;
		const cachedTime = (response?.cachedAt ?? 0) + (response?.cacheLength ?? 0);

		let data: T;
		if (this.development || !response || currentTime > response.cachedAt + response.cacheLength) {
			try {
				data = await onCache();
				const endTime = performance.now();
				const time = endTime - startTime;
				console.log(
					"\x1b[0;90m>>> \x1b[1;31mset:\x1b[0m",
					key,
					`\x1b[0;36m${currentTime}`,
					`\x1b[0;90m ... \x1b[1;32m${time} ms\x1b[0m`
				);
				memoryCache[key] = {
					data,
					cacheLength,
					cachedAt: currentTime,
				};
			} catch (err) {
				console.error(err);
				throw err;
			}
		} else {
			const endTime = performance.now();
			const time = endTime - startTime;
			console.log(
				"\x1b[0;90m<<< \x1b[0;34mget:\x1b[0m",
				key,
				`\x1b[0;36m${currentTime}`,
				`\x1b[0;36m${cachedTime}`,
				`\x1b[0;90m ... \x1b[1;32m${time} ms\x1b[0m`
			);
			data = response.data;
		}

		return data;
	};
}

const serverCache = new ServerCache();

export { serverCache };
