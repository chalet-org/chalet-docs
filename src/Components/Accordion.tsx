import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

type Props = React.PropsWithChildren<{
	label?: string;
}>;

const Accordion = ({ label, children }: Props) => {
	const { accordionNotifier } = useUiStore();

	const [open, setOpen] = useState<boolean>(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const [computedHeight, setComputedHeight] = useState<number>(0);

	// We can just use this noop to trigger re-renders
	useEffect(() => {
		setComputedHeight(contentRef.current?.clientHeight ?? 0);
	}, [accordionNotifier, contentRef.current, children]);

	const className = clsx({
		open: open,
	});

	return (
		<>
			<AccordionHandle
				className={className}
				onClick={(ev) => {
					ev.preventDefault();
					setOpen(!open);
				}}
				title={open ? "Collapse" : "Expand"}
			>
				{!!label ? label : open ? "Collapse" : "Expand"}
			</AccordionHandle>
			<AccordionContent className={className} $height={computedHeight}>
				<div className="inner" ref={contentRef}>
					{children}
				</div>
			</AccordionContent>
		</>
	);
};

export { Accordion };

const AccordionHandle = styled.button`
	display: block;
	position: relative;
	font-weight: 400;
	color: ${getThemeVariable("primaryText")};
	font-size: 1.125rem;
	line-height: 2;
	text-align: left;
	cursor: pointer;
	user-select: none;
	width: 100%;
	padding: 0;
	padding-left: 1.5rem;
	padding-bottom: 0.25rem;
	background-color: transparent;
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
		color: ${getThemeVariable("secondaryColor")};
		transition: transform 0.125s linear;
	}

	&:hover {
		border-top-color: ${getThemeVariable("primaryColor")};
		border-bottom-color: ${getThemeVariable("primaryColor")};
	}

	&.open {
		&:before {
			transform: rotate(90deg);
		}
	}
`;

type ContentProps = {
	$height: number;
};

const AccordionContent = styled.div<ContentProps>`
	display: block;
	overflow: hidden;
	max-height: 0rem;
	opacity: 0;
	transition: max-height 0.25s linear, opacity 0.25s linear;

	&.open {
		max-height: calc(${(p) => p.$height}px + 1rem);
		opacity: 1;
	}

	> .inner {
		padding: 0.5rem 1rem;
		margin: 0;
		margin-top: 0;
		margin-bottom: 1rem;
		border: 0.0625rem dashed ${getThemeVariable("border")};
		background-color: ${getThemeVariable("codeBackground")};

		> pre {
			border: 0.0625rem solid ${getThemeVariable("background")};
		}
	}
`;
