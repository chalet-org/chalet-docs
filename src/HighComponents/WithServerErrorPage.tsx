import React from "react";

import { ServerProps } from "Utility";
import { ServerErrorLayout } from "Layouts";

export function withServerErrorPage<T extends object>(
	Component: (props: T) => JSX.Element
): (props: ServerProps<T>) => JSX.Element {
	return ({ error, ...props }: ServerProps<T>) => {
		if (!!error) {
			return <ServerErrorLayout error={error} />;
		}
		return <Component {...(props as T)} />;
	};
}
