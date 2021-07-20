import { createGlobalStyle } from "styled-components";

export const BaseStyle = createGlobalStyle`
    html {
        font-size: 16px;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: Helvetica,Arial;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #fff;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }

    a {
        color: inherit;
        text-decoration: none;
    }
`;
