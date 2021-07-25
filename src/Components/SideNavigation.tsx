import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { PageThemeType } from "Theme";

type Props = {
	children?: React.ReactNode;
};

const SideNavigation = (props: Props) => {
	const { toggleNavigation, navOpen, navWidth, initialized, theme } = useUiStore();
	return (
		<>
			<SidebarToggle
				onClick={(ev) => {
					ev.preventDefault();
					toggleNavigation();
				}}
			>
				Toggle
			</SidebarToggle>
			<StyledAside
				className={`sidebar ${navOpen ? "open" : ""}`}
				width={navWidth}
				{...(!initialized ? null : { ...theme })}
			>
				Sidebar
			</StyledAside>
		</>
	);
};

export { SideNavigation };

const SidebarToggle = styled.button`
	display: block;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
`;

type AsideProps = {
	width: string;
};

const StyledAside = styled.aside<Partial<PageThemeType> & AsideProps>`
	display: block;
	position: fixed;
	bottom: 0;
	top: 0;
	left: 0;
	width: 0;
	transition: width 0.125s linear;
	z-index: 90;
	overflow: hidden;

	background-color: ${(theme) => theme.bodyBackground ?? "#000000"};
	color: ${(theme) => theme.mainText ?? "#232323"};

	&.open {
		width: ${(props) => props.width};
	}
`;
