import { GetStaticPropsResult } from "next";
import { Optional } from "@andrew-r-king/react-kitchen";

type ServerError = {
	error: Optional<string>;
};

export type ServerProps<T> = T & ServerError;

export function handleStaticProps<U extends object, T extends object = {}>(
	func: (...args: any[]) => Promise<T>,
	data: U = {} as U
): () => Promise<GetStaticPropsResult<ServerProps<T & U>>> {
	return async () => {
		try {
			const res = await func();

			return {
				props: {
					...res,
					...data,
					error: null,
				},
			};
		} catch (err) {
			console.error(err);
			return {
				props: {
					...({} as T),
					...data,
					error: err.message,
				},
			};
		}
	};
}
