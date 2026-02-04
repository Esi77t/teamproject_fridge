import { DragItem, IngredientCategory } from "@/types/fridge";
import { Ingredient } from "@/types/ingredient";
import { canMoveItem } from "@/utils/dndRules";
import { useDrop } from "react-dnd";
import * as S from "./Section.styles";
import Item from "./Item";


interface SectionProps {
    sectionId: IngredientCategory;
    title: string;
    items: Ingredient[];
    onDropItem: (id: number, target: string, source: string) => void;
    onDeleteItem: (id: number) => void;
    onMouseEnter: (item: Ingredient, e: React.MouseEvent) => void;
    onMouseLeave: () => void;
}

const Section = ({ sectionId, title, items, onDropItem, ...itemProps }: SectionProps) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'INGREDIENT',
        canDrop: (draggedItem: DragItem) => canMoveItem(draggedItem.category, sectionId),
        drop: (draggedItem: DragItem) => onDropItem(draggedItem.id, sectionId, draggedItem.sourceType),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [sectionId, onDropItem]);

    return (
        <S.SectionContainer ref={(el) => {
                if (el) drop(el);
            }} $isOver={isOver} $canDrop={canDrop}>
            <S.SectionTitle>{title}</S.SectionTitle>
            {items.map((item) => (
                <Item key={item.id} item={item} {...itemProps} />
            ))}
        </S.SectionContainer>
    );
};

export default Section;