import styled from "styled-components";

export const FridgeWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 896px; /* max-w-4xl */
    height: 700px;
    background-color: #fde68a; /* bg-amber-200 */
    border-radius: 1.5rem;
    overflow: hidden;
`;

export const FridgeDoor = styled.div<{ $isOpen: boolean }>`
    position: absolute;
    inset: 0;
    background-color: #92400e; /* bg-amber-800 */
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-right: 8px solid #78350f; /* border-amber-900 */
    transition: transform 0.7s ease-in-out;
    
    /* 문 열림 상태 반영 */
    transform: ${props => props.$isOpen ? 'translateX(-100%)' : 'translateX(0)'};
`;

export const FridgeInner = styled.div`
    height: 100%;
    background-color: #eff6ff; /* bg-blue-50 */
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;