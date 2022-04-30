import React from "react";
import styled from "styled-components";

type StyleProps = {
	color: string;
};

type Props = StyleProps &
	React.PropsWithChildren<{
		prompt: string;
	}>;

const TerminalPrompt = ({ prompt, color, children }: Props) => {
	return (
		<>
			<Styles color={color}>{prompt} </Styles>
			<span>{children}</span>
		</>
	);
};

const Styles = styled.span<StyleProps>`
	color: ${({ color }) => color};
`;

export { TerminalPrompt };
