import React from "react";

type Props = React.PropsWithChildren<{
	className?: string;
}>;

const Paragraph = ({ children, className }: Props) => {
	return <p {...{ className }}>{children}</p>;
};

export { Paragraph };
