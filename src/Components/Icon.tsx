import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { WiMoonAltWaxingGibbous5, WiMoonAltWaningGibbous1 } from "react-icons/wi";
import styled from "styled-components";

type IconID = "day" | "night" | "search" | "close";

type IconStyleProps = {
	size?: string;
	color?: string;
};

type Props = IconStyleProps & {
	id: IconID;
	onClick?: React.MouseEventHandler;
};

const getIcon = (id: IconID) => {
	switch (id) {
		case "day":
			return <WiMoonAltWaxingGibbous5 />;
		case "night":
			return <WiMoonAltWaningGibbous1 />;
		case "search":
			return <AiOutlineSearch />;
		case "close":
			return <IoCloseOutline />;
	}
	return null;
};

const Icon = ({ id, ...iconProps }: Props) => {
	return (
		<Styles {...iconProps} className={`icon-${id}`}>
			{getIcon(id)}
		</Styles>
	);
};

export { Icon };

const Styles = styled.i<IconStyleProps>`
	display: block;

	> svg {
		width: ${({ size }) => size ?? "1rem"};
		height: ${({ size }) => size ?? "1rem"};

		> path,
		> circle {
			color: ${({ color }) => color ?? "inherit"};
			fill: ${({ color }) => color ?? "inherit"};
		}
	}
`;
