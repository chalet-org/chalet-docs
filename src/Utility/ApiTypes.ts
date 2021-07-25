import { NextApiRequest, NextApiResponse } from "next";

export type ApiReq<T extends object = {}> = NextApiRequest & {
	query: Partial<T>;
};
export type ApiRes<T extends object> = NextApiResponse<T>;
