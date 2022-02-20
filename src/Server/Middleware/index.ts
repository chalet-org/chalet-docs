import { ApiReq, ApiRes } from "Utility";

import { runAuthMiddleware } from "./AuthMiddleware";
import { runCorsMiddleware } from "./CorsMiddleware";

const middlewareImpl = {
	cors: runCorsMiddleware,
	auth: runAuthMiddleware,
};

const middleware = {
	use: (args: (keyof typeof middlewareImpl)[], req: ApiReq, res: ApiRes<any>) => {
		return Promise.all(args.map((key) => middlewareImpl[key](req, res)));
	},
};

export { middleware };
