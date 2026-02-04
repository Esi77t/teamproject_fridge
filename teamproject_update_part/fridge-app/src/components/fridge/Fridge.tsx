import { Ingredient } from "@/types/ingredient";
import * as S from "./Fridge.styles";

interface FridgeProps {
    isOpen: boolean;
    toggleFridge: () => void;
    items: Ingredient[];
    onDropItem: (id: number, target: string, source: string) => void;
}

const Fridge = ({ isOpen, toggleFridge, items, onDropItem }: FridgeProps) => {
    return (
        <S.FridgeWrapper>
            {/* 냉장고 문 */}
            <S.FridgeDoor $isOpen={isOpen} onClick={toggleFridge}>
                <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                    클릭해서 열어주세요
                </span>
            </S.FridgeDoor>
        </S.FridgeWrapper>
    );
};

export default Fridge;