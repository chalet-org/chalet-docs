import { GetServerSidePropsContext, NextPageContext } from "next";

type NextPageHandler = ((ctx: NextPageContext) => Promise<any>) | ((ctx: GetServerSidePropsContext) => Promise<any>);

function withServerErrorHandler<T extends NextPageHandler>(nextMethod: T) {
	return async (ctx: any) => {
		try {
			return await nextMethod(ctx);
		} catch (err) {
			console.error(err);
			return {
				notFound: true,
			};
		}
	};
}

export { withServerErrorHandler };
