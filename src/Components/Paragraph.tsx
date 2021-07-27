import React from "react";
import styled from "styled-components";

import { ImportantNote } from "./ImportantNote";

type Props = React.PropsWithChildren<{
	className?: string;
}>;

const Paragraph = ({ children, className }: Props) => {
	if (className) {
		if (className === "tip") {
			return <ImportantNote>{children}</ImportantNote>;
		}
	}
	return <p {...{ className }}>{children}</p>;
};

export { Paragraph };
