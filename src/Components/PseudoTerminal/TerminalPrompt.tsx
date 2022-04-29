import React from "react";
import styled from "styled-components";

type StyleProps = {
	color: string;
};

type Props = StyleProps & {
	prompt: string;
};

const TerminalPrompt = ({ prompt, color }: Props) => {
	return <Styles color={color}>{prompt} </Styles>;
};

const Styles = styled.span<StyleProps>`
	color: ${({ color }) => color};
`;

export { TerminalPrompt };
