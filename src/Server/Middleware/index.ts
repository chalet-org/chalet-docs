import { ApiReq, ApiRes } from "Utility";

import { runAuthMiddleware } from "./AuthMiddleware";
import { runCorsMiddleware } from "./CorsMiddleware";

const middlewareImpl = {
	cors: runCorsMiddleware,
	auth: runAuthMiddleware,
};

const middleware = {
	use: (args: (keyof typeof middlewareImpl)[], handler: (req: ApiReq, res: ApiRes<any>) => Promise<any>) => {
		return async (req: ApiReq, res: ApiRes<any>) => {
			for (const key of args) {
				if (!req.statusCode) await middlewareImpl[key](req, res); // called in order
			}
			if (!req.statusCode) await handler(req, res);
		};
	},
	useAsync: (args: (keyof typeof middlewareImpl)[], handler: (req: ApiReq, res: ApiRes<any>) => Promise<any>) => {
		return async (req: ApiReq, res: ApiRes<any>) => {
			await Promise.all(args.map((key) => middlewareImpl[key](req, res)));
			if (!req.statusCode) await handler(req, res);
		};
	},
};

export { middleware };
