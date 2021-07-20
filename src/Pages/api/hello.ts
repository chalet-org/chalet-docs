import { Greeting } from "Api";
import { ApiReq, ApiRes } from "Utility";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const handler = (req: ApiReq, res: ApiRes<Greeting>): void => {
	res.status(200).json({ name: "John Doe" });
};

export default handler;
