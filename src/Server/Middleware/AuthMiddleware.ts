import { Optional } from "Utility";
import { ApiReq, ApiRes } from "Utility";

const validToken: Optional<string> = process.env.NEXT_PUBLIC_API_TOKEN ?? null;

const runAuthMiddleware = async (req: ApiReq, res: ApiRes<any>) => {
	try {
		if (validToken === null) {
			throw new Error("Missing: NEXT_PUBLIC_API_TOKEN");
		}

		const authToken: Optional<string> = req.headers?.authorization?.split("Bearer ")?.[1] ?? null;
		if (authToken === null || authToken !== validToken) {
			res.status(401).json({
				message: "Unauthorized",
				statusCode: 401,
			});
		}
	} catch (err: any) {
		console.error(err);
		res.status(401).json({
			message: "Unauthorized",
			statusCode: 401,
		});
	}
};

export { runAuthMiddleware };
