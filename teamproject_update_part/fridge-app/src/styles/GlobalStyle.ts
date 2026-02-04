import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
        background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
        min-height: 100vh;
    }
    * { box-sizing: border-box; }
`