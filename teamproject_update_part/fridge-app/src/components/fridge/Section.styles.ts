import styled from "styled-components";

interface ContainerProps {
    $isOver: boolean;
    $canDrop: boolean;
}

export const SectionContainer = styled.div<ContainerProps>`
    flex: 1;
    min-height: 200px;
    border: 1px solid #bfdbfe;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin: 0.5rem;
    transition: all 0.2s ease;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;

    /* 드롭 가능 여부에 따른 배경색 변화 */
    background-color: ${props => {
        if (props.$isOver && props.$canDrop) return '#dbeafe'; // 활성 (연파랑)
        if (props.$isOver && !props.$canDrop) return '#fee2e2'; // 불가능 (연빨강)
        return '#f8fafc'; // 기본
    }};

    border: ${props => (props.$isOver ? '2px solid' : '1px solid')};
    border-color: ${props => {
        if (props.$isOver && props.$canDrop) return '#60a5fa';
        if (props.$isOver && !props.$canDrop) return '#f87171';
        return '#bfdbfe';
    }};
`;

export const SectionTitle = styled.h3`
    width: 100%;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.5rem;
`;