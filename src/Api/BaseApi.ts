import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource } from "axios";

// TODO: Use fetch, move to npm package

const logError = (err: any, source: CancelTokenSource) => {
	if (axios.isCancel(err)) {
		source.cancel("Request canceled");
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

type ApiResponseWithBody<T> = ApiResponse & {
	data: T;
};

export abstract class BaseApi {
	private axios: AxiosInstance;
	private contentType = "application/json";
	private config: AxiosRequestConfig = {};

	constructor(private baseUrl: string, config?: AxiosRequestConfig) {
		if (config) {
			this.axios = axios.create(config);
		} else {
			this.axios = axios;
		}
	}

	private getRequestConfig = (source: CancelTokenSource): AxiosRequestConfig => {
		// TODO: Potential for header customization
		// TODO: Also, general authentication
		return {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "*",
				"Content-Type": this.contentType,
				...this.config?.headers,
			},
			cancelToken: source.token,
			...this.config,
		};
	};

	protected setConfig = (config: AxiosRequestConfig): void => {
		this.config = config;
	};

	protected OPTIONS = async <T extends object>(route: string): Promise<ApiResponseWithBody<T>> => {
		const source = axios.CancelToken.source();
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(source);
			const result: ApiResponseWithBody<T> = await this.axios.options(this.baseUrl + route, requestConfig);
			return result;
		} catch (err) {
			logError(err, source);
			throw err;
		}
	};

	protected GET = async <T extends object>(route: string): Promise<T> => {
		const source = axios.CancelToken.source();
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(source);
			const result: ApiResponseWithBody<T> = await this.axios.get(this.baseUrl + route, requestConfig);
			return result.data;
		} catch (err) {
			logError(err, source);
			throw err;
		}
	};

	protected HEAD = async (route: string): Promise<any> => {
		const source = axios.CancelToken.source();
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(source);
			const result = await this.axios.head(this.baseUrl + route, requestConfig);
			return result.headers;
		} catch (err) {
			logError(err, source);
			throw err;
		}
	};

	protected POST = async <T extends object, Data extends object>(route: string, data: Data): Promise<T> => {
		const source = axios.CancelToken.source();
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(source);
			const result: ApiResponseWithBody<T> = await this.axios.post(this.baseUrl + route, data, requestConfig);
			return result.data;
		} catch (err) {
			logError(err, source);
			throw err;
		}
	};

	protected PUT = async <Data extends object>(route: string, data: Data): Promise<ApiResponse> => {
		const source = axios.CancelToken.source();
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(source);
			const result: ApiResponse = await this.axios.put(this.baseUrl + route, data, requestConfig);

			const created = result.status === 201;
			const modified = result.status === 200 || result.status === 204;

			if (!created && !modified) {
				throw new Error(
					`Invalid or unexpected response status from PUT '${route}': received ${result.status} (${result.statusText})`
				);
			}

			return result;
		} catch (err) {
			logError(err, source);
			throw err;
		}
	};

	protected PATCH = async <T extends object, Data extends object>(route: string, data: Data): Promise<T> => {
		const source = axios.CancelToken.source();
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(source);
			const result: ApiResponseWithBody<T> = await this.axios.patch(this.baseUrl + route, data, requestConfig);

			const validStatusCode = result.status >= 200 && result.status < 300;
			if (!validStatusCode) {
				throw new Error(
					`Invalid or unexpected response status from PATCH '${route}': received ${result.status} (${result.statusText})`
				);
			}

			return result.data;
		} catch (err) {
			logError(err, source);
			throw err;
		}
	};

	protected DELETE = async (route: string): Promise<boolean> => {
		const source = axios.CancelToken.source();
		try {
			validateForwardSlash(route);

			const requestConfig = this.getRequestConfig(source);
			const result: ApiResponse = await this.axios.delete(this.baseUrl + route, requestConfig);

			const noContent = result.status === 204;
			const validStatusCode = result.status === 200 || result.status === 202;

			if (!noContent && !validStatusCode) {
				throw new Error(
					`Invalid or unexpected response status from DELETE '${route}': received ${result.status} (${result.statusText})`
				);
			}

			return !noContent && validStatusCode;
		} catch (err) {
			logError(err, source);
			throw err;
		}
	};
}
