import { GetStaticPropsResult } from "next";
import { Optional } from "@andrew-r-king/react-kitchen";

export type ServerError = {
	message: string;
	status: number;
};

export type ServerProps<T extends object> = T & {
	error: Optional<ServerError>;
};

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
			// console.error(err);
			return {
				props: {
					...({} as T),
					...data,
					error: {
						message: err.message,
						status: err.status ?? 500,
					},
				},
			};
		}
	};
}
