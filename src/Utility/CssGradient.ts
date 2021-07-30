import { css } from "styled-components";

const makeLinearGradient = (from: string, to: string, degrees: number = 0) => {
	return `
	background: ${to};
	background: linear-gradient(${degrees}deg, ${from} 0%, ${to} 100%);
`;
};
export { makeLinearGradient };
