import React from "react";

import { ServerErrorLayout } from "Layouts";
import { ServerProps } from "Utility";

export function withServerErrorPage<T extends object>(
	Component: (props: T) => JSX.Element
): React.FunctionComponent<ServerProps<T>> {
	return ({ error, ...props }: ServerProps<T>) => {
		if (!!error) {
			return <ServerErrorLayout error={error} />;
		}
		return <Component {...(props as T)} />;
	};
}
