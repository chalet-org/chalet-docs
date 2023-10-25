import React from "react";
import styled from "styled-components";

type Props = React.HTMLProps<HTMLImageElement>;

const Image = (props: Props) => {
	return <Styles {...props} alt={props.alt ?? ""} title={props.title ?? props.alt} />;
};

export { Image };

const Styles = styled.img``;
