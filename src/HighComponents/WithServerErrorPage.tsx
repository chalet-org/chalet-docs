import { NextPageContext } from "next";
import React from "react";

import { ServerErrorLayout } from "Layouts";
import { ServerProps } from "Utility";

export function withServerErrorPage<T extends object>(
	Component: (props: T) => JSX.Element
): React.FunctionComponent<ServerProps<T>> & {
	getInitialProps?: (ctx: NextPageContext) => Promise<any>;
} {
	return ({ error, ...props }: ServerProps<T>) => {
		if (!!error) {
			return <ServerErrorLayout error={error} />;
		}
		return <Component {...(props as T)} />;
	};
}
