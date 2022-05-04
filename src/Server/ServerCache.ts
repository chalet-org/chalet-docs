import { performance } from "perf_hooks";

import { Dictionary } from "@rewrking/react-kitchen";

import { isDevelopment } from "./IsDevelopment";

type AnsiColorsForeground = 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37;
type AnsiColorsForegroundBright = 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97;
type AnsiColors = AnsiColorsForeground | AnsiColorsForegroundBright;
type AnsiStyle = 1 | 0;

const ansi = (color: AnsiColors, style: AnsiStyle = 1): string => {
	return `\x1b[${style};${color}m`;
};
const ansiReset = (): string => {
	return `\x1b[0m`;
};

const gray = ansi(90, 0);
const yellow = ansi(33);
const red = ansi(31);
const blue = ansi(34, 0);
const reset = ansiReset();
const cyan = ansi(36, 0);
const green = ansi(32);

type CacheEntry<T> = {
	data: T;
	cacheLength: number;
	cachedAt: number;
};

const lineWidth = 122;

class ServerCache {
	private development: boolean;
	private cacheSeconds: number;
	private cache: Dictionary<CacheEntry<any>> = {};

	constructor() {
		this.development = isDevelopment;
		// this.development = false;

		const hours = 4;
		this.cacheSeconds = 60 * 60 * hours;
		// this.cacheSeconds = 15;
	}

	private print = (action: string, key: string, cached: string, time: number) => {
		const outTime: string = ` ${green}${time.toFixed(3)} ms${reset}`;
		let text = `${action}${gray}:${reset} ${key}${gray} `;
		while (text.length < lineWidth - outTime.length) {
			text += ".";
		}
		text += `${outTime} ${cyan}${cached}${reset}`;
		console.log(text);
	};

	get = async <T>(key: string, onCache: () => Promise<T>, cacheLength?: number): Promise<T> => {
		const startTime = performance.now();
		const response = this.cache[key] ?? null;
		cacheLength = cacheLength ?? this.cacheSeconds;

		const currentTime: number = parseInt((new Date().getTime() / 1000).toFixed(), 10);
		const expiresAt = (response?.cachedAt ?? 0) + (response?.cacheLength ?? 0);

		let data: T;
		const needsUpdate: boolean = !!response && currentTime > response.cachedAt + response.cacheLength;
		if (this.development || !response || needsUpdate) {
			try {
				data = await onCache();
				const endTime = performance.now();
				const time = endTime - startTime;
				const action = `${gray}>>> ` + (needsUpdate ? `${yellow}upd` : `${red}set`);
				this.print(action, key, `${currentTime} ${gray}----------`, time);
				this.cache[key] = {
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
			const action = `${gray}<<< ${blue}get`;
			this.print(action, key, `${currentTime} ${expiresAt}`, time);
			data = response.data;
		}

		return data;
	};
}

const serverCache = new ServerCache();

export { serverCache };
