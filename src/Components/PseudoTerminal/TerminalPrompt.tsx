import React from "react";
import styled from "styled-components";

type Props = React.PropsWithChildren<{
	prompt: string;
	color: string;
}>;

const TerminalPrompt = ({ prompt, color, children }: Props) => {
	return (
		<>
			<Styles $color={color}>{prompt} </Styles>
			<span>{children}</span>
		</>
	);
};

type StyleProps = {
	$color: string;
};

const Styles = styled.span<StyleProps>`
	color: ${(p) => p.$color};
`;

export { TerminalPrompt };
