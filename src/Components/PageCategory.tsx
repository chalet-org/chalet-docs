import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

const getNameFromId = (id: string) => {
	switch (id) {
		case "docs":
			return "Documentation";
		case "ides":
			return "Integrations";
	}
	return "Unknown";
};

type Props = {
	id: string;
};

const PageCategory = ({ id }: Props) => {
	const name = getNameFromId(id);
	return <Styles>{name}</Styles>;
};

export { PageCategory };

const Styles = styled.h6`
	display: block;
	font-weight: 400;
	padding-bottom: 0;
	color: ${getThemeVariable("primaryColor")};
`;
