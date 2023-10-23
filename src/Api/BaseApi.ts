import { Dictionary, Optional } from "Utility";
import fetch from "isomorphic-fetch";

// TODO: Use fetch, move to npm package

const logError = (err: any, abortController: AbortController) => {
	if (abortController.signal.aborted) {
		// source.cancel("Request canceled");
	} else {
		// console.error(err);
	}
};

const validateForwardSlash = (route: string) => {
	if (!route.startsWith("/")) throw new Error(`Route '${route}' must start with '/'`);
};

type ApiResponse = {
	headers: any;
	request?: any;
	status: number;
	statusText: string;
};

export enum FetchMethod {
	POST = "POST",
	GET = "GET",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE",
	OPTIONS = "OPTIONS",
	HEAD = "HEAD",
}

export type FetchConfig = {
	headers?: Dictionary<string>;
};

type PrivateFetchConfig = FetchConfig & {
	method: FetchMethod;
	mode: "cors" | "no-cors" | "same-origin";
	cache: "default" | "no-cache" | "reload" | "force-cache" | "only-if-cached";
	credentials: "same-origin" | "include" | "omit";
	referrerPolicy:
		| "no-referrer"
		| "no-referrer-when-downgrade"
		| "origin"
		| "origin-when-cross-origin"
		| "same-origin"
		| "strict-origin"
		| "strict-origin-when-cross-origin"
		| "unsafe-url";
	signal: AbortSignal;
	body?: string;
};

function makeFetchCall(route: string, config: PrivateFetchConfig): Promise<Response> {
	return fetch(route, config);
}

export abstract class BaseApi {
	private contentType = "application/json";
	private abortController: AbortController = new AbortController();

	constructor(private baseUrl: string, private config: FetchConfig = {}) {}

	private getRequestConfig = (method: FetchMethod, data?: Record<string, any>): PrivateFetchConfig => {
		// TODO: Potential for header customization
		// TODO: Also, general authentication
		return {
			method,
			mode: "cors",
			cache: "default",
			credentials: "same-origin",
			referrerPolicy: "no-referrer",
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "*",
				"Content-Type": this.contentType,
				...this.config?.headers,
			},
			body: !!data ? JSON.stringify(data) : undefined,
			signal: this.abortController.signal,
			...this.config,
		};
	};

	protected OPTIONS = async (route: string): Promise<Optional<Response>> => {
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(FetchMethod.OPTIONS);
			const result = await makeFetchCall(this.baseUrl + route, requestConfig);
			return result;
		} catch (err) {
			logError(err, this.abortController);
			return null;
		}
	};

	protected GET = async <T extends object>(route: string): Promise<Optional<T>> => {
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(FetchMethod.GET);
			const result = await makeFetchCall(this.baseUrl + route, requestConfig);
			if (!result.ok) {
				throw new Error(result.statusText);
			}
			return result.json() as T;
		} catch (err) {
			logError(err, this.abortController);
			return null;
		}
	};

	protected HEAD = async (route: string): Promise<any> => {
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(FetchMethod.HEAD);
			const result = await makeFetchCall(this.baseUrl + route, requestConfig);
			return result.headers;
		} catch (err) {
			logError(err, this.abortController);
			return null;
		}
	};

	protected POST = async <T extends object, Data extends object>(route: string, data: Data): Promise<Optional<T>> => {
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(FetchMethod.POST, data);
			const result = await makeFetchCall(this.baseUrl + route, requestConfig);
			if (!result.ok) {
				throw new Error(result.statusText);
			}
			return result.json() as T;
		} catch (err) {
			logError(err, this.abortController);
			return null;
		}
	};

	protected PUT = async <Data extends object>(route: string, data: Data): Promise<Optional<ApiResponse>> => {
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(FetchMethod.PUT, data);
			const result: ApiResponse = await makeFetchCall(this.baseUrl + route, requestConfig);

			const created = result.status === 201;
			const modified = result.status === 200 || result.status === 204;

			if (!created && !modified) {
				throw new Error(
					`Invalid or unexpected response status from PUT '${route}': received ${result.status} (${result.statusText})`
				);
			}

			return result;
		} catch (err) {
			logError(err, this.abortController);
			return null;
		}
	};

	protected PATCH = async <T extends object, Data extends object>(
		route: string,
		data: Data
	): Promise<Optional<T>> => {
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(FetchMethod.PATCH, data);
			const result = await makeFetchCall(this.baseUrl + route, requestConfig);

			const validStatusCode = result.status >= 200 && result.status < 300;
			if (!validStatusCode) {
				throw new Error(
					`Invalid or unexpected response status from PATCH '${route}': received ${result.status} (${result.statusText})`
				);
			}

			return result.json();
		} catch (err) {
			logError(err, this.abortController);
			return null;
		}
	};

	protected DELETE = async (route: string): Promise<boolean> => {
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(FetchMethod.DELETE);
			const result: ApiResponse = await fetch(this.baseUrl + route, requestConfig);

			const noContent = result.status === 204;
			const validStatusCode = result.status === 200 || result.status === 202;

			if (!noContent && !validStatusCode) {
				throw new Error(
					`Invalid or unexpected response status from DELETE '${route}': received ${result.status} (${result.statusText})`
				);
			}

			return !noContent && validStatusCode;
		} catch (err) {
			logError(err, this.abortController);
			return false;
		}
	};
}
