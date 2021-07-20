import { NextApiRequest, NextApiResponse } from "next";

export type ApiReq = NextApiRequest;
export type ApiRes<T extends any> = NextApiResponse<T>;
