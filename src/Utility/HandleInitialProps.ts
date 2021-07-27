import { NextPageContext } from "next";

import { Optional } from "@andrew-r-king/react-kitchen";

export type ServerError = {
	message: string;
	status: number;
};

export type ServerProps<T extends object> = T & {
	error: Optional<ServerError>;
};

export function handleInitialProps<U extends object, T extends object = {}>(
	func: (ctx: NextPageContext) => Promise<T>,
	data: U = {} as U
): (ctx: NextPageContext) => Promise<ServerProps<T & U>> {
	return async (ctx: NextPageContext) => {
		try {
			const res = await func(ctx);

			return {
				...res,
				...data,
				error: null,
			};
		} catch (err) {
			// console.log(err);
			const { status } = err.response;
			return {
				...({} as T),
				...data,
				error: {
					message: err.message,
					status: status ?? 500,
				},
			};
		}
	};
}
