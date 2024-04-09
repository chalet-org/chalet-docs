import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";
import { Image } from "Components";

type Props = Omit<React.HTMLProps<HTMLImageElement>, "ref" | "crossOrigin" | "as"> & {};

const InlineImage = (props: Props) => {
	return (
		<Styles>
			<Image alt="" {...props} />
		</Styles>
	);
};

export { InlineImage };

const Styles = styled.span`
	display: block;
	padding: 0 1rem;
	padding-bottom: 1rem;

	> img {
		border: 0.25rem solid ${getThemeVariable("codeBackground")};
	}
`;
