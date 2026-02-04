import styled from "styled-components";

export const PageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    min-height: 100vh;
`;

export const MainContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 1280px; /* max-w-7xl */
    height: 800px;
    background-color: white;
    border-radius: 2rem;
    shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
    overflow: hidden;
`;

export const ContentArea = styled.main`
    flex: 1;
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;