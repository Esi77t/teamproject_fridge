import { Ingredient } from "@/types/ingredient";
import { useDrag } from "react-dnd";
import * as S from "./Item.styles";

interface ItemProps {
    item: Ingredient;
    onDeleteItem: (id: number) => void;
    onMouseEnter: (item: Ingredient, e: React.MouseEvent) => void;
    onMouseLeave: () => void;
}

const Item = ({ item, onDeleteItem, onMouseEnter, onMouseLeave }: ItemProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'INGREDIENT',
        item: { id: item.id, sourceType: 'fridge', category: item.category },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }));

    return (
        <S.ItemBox
            ref={(el) => {
                if (el) drag(el);
            }}
            $isDragging={isDragging}
            $daysLeft={item.daysLeft}
            onMouseEnter={(e) => onMouseEnter(item, e)}
            onMouseLeave={onMouseLeave}
        >
            <S.DeleteBtn onClick={() => onDeleteItem(item.id)}>&times;</S.DeleteBtn>
            <span style={{ fontSize: '1.875rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.name}</span>
        </S.ItemBox>
    );
};

export default Item;