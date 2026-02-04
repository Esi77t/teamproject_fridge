import styled from "styled-components";

export const ItemBox = styled.div<{ $isDragging: boolean; $daysLeft: number }>`
    position: relative;
    width: 80px;
    height: 80px;
    background-color: white;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0.25rem;
    cursor: grab;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.15s ease;
    opacity: ${props => (props.$isDragging ? 0 : 1)};

    /* 유통기한 3일 이내 강조 */
    border: ${props => (props.$daysLeft <= 3 ? '2px solid #ef4444' : '1px solid #e2e8f0')};

    &:hover {
        transform: scale(1.05);
    }
`;

export const DeleteBtn = styled.button`
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background-color: #ef4444;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border: none;
    cursor: pointer;
    z-index: 10;
    &:hover { background-color: #dc2626; }
`;