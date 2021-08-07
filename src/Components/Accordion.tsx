import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { styleVariables } from "Components";
import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{
	label?: string;
}>;

const Accordion = ({ label, children }: Props) => {
	const { accordionNotifier, notifyHeightChange } = useUiStore();

	const [open, setOpen] = useState<boolean>(false);
	const [height, setHeight] = useState<number>(0);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current && contentRef.current.clientHeight !== height) {
			setHeight(contentRef.current.clientHeight);
		}
	}, [accordionNotifier, height, contentRef]);

	const className = open ? "open" : "";

	const { baseFontSize } = styleVariables;
	const marginTop = 0;
	const marginBottom = 1.0;
	const computedRemHeight = (height + baseFontSize * (marginTop + marginBottom)) / baseFontSize;

	return (
		<>
			<AccordionHandle
				className={className}
				onClick={(ev) => {
					ev.preventDefault();
					setOpen(!open);
				}}
			>
				{!!label ? label : open ? "Collapse" : "Expand"}
			</AccordionHandle>
			<AccordionContent
				className={className}
				height={computedRemHeight}
				marginTop={marginTop}
				marginBottom={marginBottom}
				onAnimationEnd={() => {
					notifyHeightChange();
				}}
			>
				<div className="inner" ref={contentRef}>
					{children}
				</div>
			</AccordionContent>
		</>
	);
};

export { Accordion };

const AccordionHandle = styled.div`
	display: block;
	position: relative;
	font-weight: 600;
	font-size: 1.125rem;
	line-height: 2;
	cursor: pointer;
	user-select: none;
	padding-left: 1.5rem;
	padding-bottom: 0.25rem;
	border-top: 0.0675rem dashed transparent;
	border-bottom: 0.0625rem dashed transparent;
	transition: border-top-color 0.125s linear, border-bottom-color 0.125s linear;

	&:before {
		display: block;
		position: absolute;
		left: 0.25rem;
		content: "\u276F\u276F";
		font-size: 0.825rem;
		font-weight: 400;
		letter-spacing: -0.125rem;
		line-height: 0;
		top: calc(50% - 0.125rem);
		color: ${getCssVariable("Cyan")};
		transition: transform 0.125s linear;
	}

	&:hover {
		border-top-color: ${getCssVariable("Accent")};
		border-bottom-color: ${getCssVariable("Accent")};
	}

	&.open {
		&:before {
			transform: rotate(90deg);
		}
	}
`;

type ContentProps = {
	height: number;
	marginTop: number;
	marginBottom: number;
};

const AccordionContent = styled.div<ContentProps>`
	display: block;
	overflow: hidden;
	max-height: 0rem;
	opacity: 0;
	transition: max-height 0.25s linear, opacity 0.25s linear;

	&.open {
		max-height: ${({ height }) => height}rem;
		opacity: 1;
	}

	> .inner {
		padding: 0.5rem 1rem;
		margin: 0;
		margin-top: ${({ marginTop }) => marginTop}rem;
		margin-bottom: ${({ marginBottom }) => marginBottom}rem;
		border: 0.0625rem dashed ${getCssVariable("Border")};
		background-color: ${getCssVariable("BackgroundCode")};
	}
`;
