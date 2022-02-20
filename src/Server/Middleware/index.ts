import { ApiReq, ApiRes } from "Utility";

import { runAuthMiddleware } from "./AuthMiddleware";
import { runCorsMiddleware } from "./CorsMiddleware";

const middlewareImpl = {
	cors: runCorsMiddleware,
	auth: runAuthMiddleware,
};

type AllowedMiddleware = keyof Omit<typeof middlewareImpl, "cors">;

const defaultMiddleware: (keyof typeof middlewareImpl)[] = ["cors"];

const middleware = {
	use: (args: AllowedMiddleware[], handler: (req: ApiReq, res: ApiRes<any>) => Promise<any>) => {
		return async (req: ApiReq, res: ApiRes<any>) => {
			const statusCode = res.statusCode;
			res.statusCode = 0;
			for (const key of [...defaultMiddleware, ...args]) {
				if (!res.statusCode) await middlewareImpl[key](req, res); // called in order
			}
			if (!res.statusCode) await handler(req, res);
			if (!res.statusCode) res.statusCode = statusCode;
		};
	},
	useAsync: (args: AllowedMiddleware[], handler: (req: ApiReq, res: ApiRes<any>) => Promise<any>) => {
		return async (req: ApiReq, res: ApiRes<any>) => {
			const statusCode = res.statusCode;
			res.statusCode = 0;
			await Promise.all([...defaultMiddleware, ...args].map((key) => middlewareImpl[key](req, res)));
			if (!res.statusCode) await handler(req, res);
			if (!res.statusCode) res.statusCode = statusCode;
		};
	},
};

export { middleware };
