import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

type Props = React.PropsWithChildren<{
	className?: string;
	label?: string;
	title?: string;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
}>;

const Button = ({ children, className, label, title, type, onClick }: Props) => {
	return (
		<Styles
			className={className}
			type={type}
			onTouchStart={(ev) => (ev.target as any).classList.add("touch-hover")}
			onTouchEnd={(ev) => (ev.target as any).classList.remove("touch-hover")}
			onClick={
				onClick
					? (ev) => {
							ev.preventDefault();
							onClick();
					  }
					: undefined
			}
			title={title ?? label}
		>
			{label ?? children}
		</Styles>
	);
};

type ButtonLinkProps = Omit<Props, "onClick"> & {
	to: string;
};

const ButtonLink = ({ to, ...props }: ButtonLinkProps) => {
	const router = useRouter();
	return (
		<Button
			{...props}
			onClick={() => {
				router.push(to, undefined, {
					scroll: false,
				});
			}}
		/>
	);
};

export { Button, ButtonLink };

const Styles = styled.button`
	display: block;
	position: relative;
	font-weight: 400;
	padding: 1.25rem 1rem;
	line-height: 1;
	color: ${getThemeVariable("primaryText")};
	background-color: transparent;
	border-radius: 0.25rem;
	cursor: pointer;

	transition: background-color 0.125s linear, color 0.125s linear;

	&:hover,
	&.touch-hover {
		color: ${getThemeVariable("background")};
		background-color: ${getThemeVariable("primaryColor")};
	}
`;
