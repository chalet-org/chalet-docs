import React, { useState } from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{
	label?: string;
}>;

const Accordion = ({ label, children }: Props) => {
	const [open, setOpen] = useState<boolean>(false);
	const className = open ? "open" : "";
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
			<AccordionContent className={className}>{children}</AccordionContent>
		</>
	);
};

export { Accordion };

const AccordionHandle = styled.div`
	display: block;
	position: relative;
	font-weight: 600;
	font-size: 1.125rem;
	line-height: 2.5;
	cursor: pointer;
	user-select: none;
	padding-left: 1.5rem;

	&:before {
		display: block;
		position: absolute;
		left: 0;
		content: "\u276F";
	}

	&.open {
		&:before {
			transform: rotate(90deg);
		}
	}
`;

const AccordionContent = styled.div`
	display: block;
	overflow: hidden;
	height: 0;

	&.open {
		padding: 0.5rem 1rem;
		border: 0.0625rem dashed ${getCssVariable("Border")};
		margin: 0;
		margin-top: 0.5rem;
		margin-bottom: 2rem;
		height: auto;
	}
`;
