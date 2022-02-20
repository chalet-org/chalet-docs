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
			for (const key of [...defaultMiddleware, ...args]) {
				if (!req.statusCode) await middlewareImpl[key](req, res); // called in order
			}
			if (!req.statusCode) await handler(req, res);
		};
	},
	useAsync: (args: AllowedMiddleware[], handler: (req: ApiReq, res: ApiRes<any>) => Promise<any>) => {
		return async (req: ApiReq, res: ApiRes<any>) => {
			await Promise.all([...defaultMiddleware, ...args].map((key) => middlewareImpl[key](req, res)));
			if (!req.statusCode) await handler(req, res);
		};
	},
};

export { middleware };
