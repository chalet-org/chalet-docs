import React from "react";
import { WiMoonAltWaxingGibbous5, WiMoonAltWaningGibbous1 } from "react-icons/wi";
import styled from "styled-components";

type IconID = "day" | "night";

type IconStyleProps = {
	size?: string;
	color?: string;
};

type Props = IconStyleProps & {
	id: IconID;
};

const getIcon = (id: IconID) => {
	switch (id) {
		case "day":
			return <WiMoonAltWaxingGibbous5 />;
		case "night":
			return <WiMoonAltWaningGibbous1 />;
	}
	return null;
};

const Icon = ({ id, ...iconProps }: Props) => {
	return <Styles {...iconProps}>{getIcon(id)}</Styles>;
};

export { Icon };

const Styles = styled.i<IconStyleProps>`
	display: block;

	> svg {
		width: ${({ size }) => size ?? "1rem"};
		height: ${({ size }) => size ?? "1rem"};

		> path,
		> circle {
			fill: ${({ color }) => color ?? "inherit"};
		}
	}
`;
