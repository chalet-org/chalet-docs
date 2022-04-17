import React from "react";
import { AiOutlineSearch, AiFillApple, AiFillWindows } from "react-icons/ai";
import { BiCodeCurly } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { VscGithub, VscTerminalLinux, VscTerminalUbuntu, VscTerminalDebian } from "react-icons/vsc";
import { WiMoonAltWaxingGibbous5, WiMoonAltWaningGibbous1 } from "react-icons/wi";
import styled from "styled-components";

type IconID =
	| "day"
	| "night"
	| "search"
	| "close"
	| "apple"
	| "windows"
	| "linux"
	| "ubuntu"
	| "debian"
	| "source"
	| "github";

type IconStyleProps = {
	size?: string;
	color?: string;
	hoverColor?: string;
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
		case "apple":
			return <AiFillApple />;
		case "windows":
			return <AiFillWindows />;
		case "linux":
			return <VscTerminalLinux />;
		case "ubuntu":
			return <VscTerminalUbuntu />;
		case "debian":
			return <VscTerminalDebian />;
		case "source":
			return <BiCodeCurly />;
		case "github":
			return <VscGithub />;
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
		color: ${({ color }) => color ?? "inherit"};

		> path,
		> circle {
			color: ${({ color }) => color ?? "inherit"};
			fill: ${({ color }) => color ?? "inherit"};
		}
	}

	&:hover {
		> svg {
			> path,
			> circle {
				color: ${({ hoverColor }) => hoverColor ?? "inherit"};
				fill: ${({ hoverColor }) => hoverColor ?? "inherit"};
			}
		}
	}
`;
