import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const TabbedContent = ({ children }: Props) => {
	const [activeTab, setActiveTab] = useState<number>(0);
	let i: number = -1;
	children = React.Children.map(children, (child: any) => {
		if (!child || typeof child == "number" || typeof child == "boolean" || typeof child == "string") return child;

		if (child.props?.mdxType && child.props?.mdxType === "button") {
			++i;
			const index = i;
			return {
				...child,
				props: {
					...child.props,
					className: i === activeTab ? "active" : undefined,
					onClick: (ev: any) => {
						ev.preventDefault();
						setActiveTab(index);
					},
				},
			};
		}
		return child;
	});
	return <Styles>{children}</Styles>;
};

export { TabbedContent };

const Styles = styled.div`
	display: flex;
	flex-wrap: wrap;
	position: relative;
	padding-top: 1rem;
	padding-bottom: 2rem;

	> button {
		order: -1;
		position: relative;
		margin: 0;
		padding: 0.25rem 1.5rem;
		padding-top: 0.375rem;
		padding-bottom: 0.125rem;
		background: transparent;
		color: ${getCssVariable("Header")};
		background-color: ${getCssVariable("BackgroundCode")};
		border: 0.0625rem solid ${getCssVariable("Border")};
		cursor: pointer;
		z-index: 4;
		transition: color 0.125s linear;

		&:not(.active):hover {
			color: ${getCssVariable("MainText")};
		}

		&.active {
			color: ${getCssVariable("MainText")};
			background-color: transparent;
			border-top: 0.25rem solid ${getCssVariable("Accent")};
			border-bottom-color: ${getCssVariable("Background")};
			padding-top: 0.125rem;
		}

		& ~ button {
			margin-left: -0.0625rem;
		}
	}

	> div.tab {
		display: none;
		visibility: visible;
		position: relative;
		overflow: auto;
		height: auto;
		width: 100%;
		padding: 1.125rem;
		border: 0.0625rem solid ${getCssVariable("Border")};
		background-color: ${getCssVariable("Background")};
		margin-top: -0.0625rem;
	}

	> button.active + div.tab {
		display: block;
	}
`;
