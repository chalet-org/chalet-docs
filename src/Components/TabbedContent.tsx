import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useOperatingSystem } from "Hooks";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const isTabOperatingSystem = (name: string): boolean => {
	const lowerName = name.toLowerCase();
	const [platform, commonCompiler] = useOperatingSystem();
	return lowerName === platform || lowerName === commonCompiler;
};

const TabbedContent = ({ children }: Props) => {
	const { notifyAccordions } = useUiStore();

	const [activeTab, setActiveTab] = useState<number>(-1);

	useEffect(() => {
		notifyAccordions();
	}, []);

	let i: number = -1;
	let activeTabSet: boolean = false;
	children = React.Children.map(children, (child: any, index: number) => {
		if (!child || typeof child == "number" || typeof child == "boolean" || typeof child == "string") {
			return child;
		}

		if ((child.props?.mdxType ?? child.type) === "button" || child.type === "button") {
			++i;
			const index = i;
			let tab = activeTab;
			if (tab === -1 && child.props.children && typeof child.props.children === "string") {
				if (isTabOperatingSystem(child.props.children)) {
					tab = index;
				}
			}

			if (i === tab) {
				activeTabSet = true;
			}

			return {
				...child,
				props: {
					...child.props,
					className: i === tab ? "active" : undefined,
					onClick: (ev: any) => {
						ev.preventDefault();
						setActiveTab(index);
						notifyAccordions();
					},
				},
			};
		}
		return child;
	});

	if (!activeTabSet) {
		children = React.Children.map(children, (child: any, index: number) => {
			if (
				activeTabSet ||
				!child ||
				typeof child == "number" ||
				typeof child == "boolean" ||
				typeof child == "string"
			)
				return child;

			if ((child.props?.mdxType ?? child.type) === "button" || child.type === "button") {
				activeTabSet = true;
				return {
					...child,
					props: {
						...child.props,
						className: "active",
					},
				};
			}
		});
	}

	return <Styles className="tab-wrapper">{children}</Styles>;
};

export { TabbedContent };

const Styles = styled.div`
	display: flex;
	flex-wrap: wrap;
	position: relative;
	padding-top: 1rem;
	padding-bottom: 0.5rem;

	> button {
		order: -1;
		position: relative;
		margin: 0;
		padding: 0.5rem 1.5rem;
		padding-top: 0.375rem;
		background: transparent;
		color: ${getThemeVariable("header")};
		background-color: ${getThemeVariable("codeBackground")};
		border: 0.0625rem solid ${getThemeVariable("border")};
		cursor: pointer;
		z-index: 4;
		transition: color 0.125s linear, border-top-color 0.125s linear;

		&:not(.active):hover {
			color: ${getThemeVariable("mainText")};
		}

		&.active {
			color: ${getThemeVariable("mainText")};
			background-color: ${getThemeVariable("background")};
			border-top: 0.25rem solid ${getThemeVariable("primaryColor")};
			border-bottom-color: ${getThemeVariable("background")};
			padding-top: 0.125rem;

			&:hover {
				border-top-color: ${getThemeVariable("secondaryColor")};
			}
		}

		& ~ button {
			margin-left: -0.0625rem;
		}
	}

	> div.tab-content {
		display: none;
		visibility: visible;
		position: relative;
		overflow: auto;
		height: auto;
		width: 100%;
		padding: 1.125rem 1.5rem;
		border: 0.0625rem solid ${getThemeVariable("border")};
		background-color: ${getThemeVariable("background")};
		margin-top: -0.0625rem;
	}

	> button.active + div.tab-content {
		display: block;
	}
`;
