import Cors from "cors";

import { ApiReq, ApiRes } from "Utility";

// Initializing the cors middleware
const cors = Cors({
	methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
const runCorsMiddleware = (req: ApiReq, res: ApiRes<any>) => {
	return new Promise((resolve, reject) => {
		cors(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
};

export { runCorsMiddleware };
