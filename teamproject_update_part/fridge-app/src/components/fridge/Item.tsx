import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useFridge } from '@/contexts/FridgeContext';
import { Ingredient } from '@/types';
import { formatDate, getCategoryEmoji, getDaysLeftText, getExpirationColor } from '@/utils/constants';

interface ItemProps {
    item: Ingredient;
}

const Item = ({ item }: ItemProps) => {
    const { removeIngredient } = useFridge();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `ingredient-${item.id}`,
        data: {
            type: 'ingredient',
            item,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (window.confirm(`${item.name}을(를) 삭제하시겠습니까?`)) {
            try {
                await removeIngredient(item.id);
            } catch (error) {
                alert('삭제에 실패했습니다.');
            }
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`relative w-20 h-20 bg-white rounded-lg flex flex-col items-center justify-center p-1 m-1 cursor-grab active:cursor-grabbing shadow-md ${isDragging ? 'ring-2 ring-blue-500' : ''
                } transform transition-transform duration-150 ease-in-out hover:scale-105`}
        >
            {/* 삭제 버튼 */}
            <button
                onClick={handleDelete}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors duration-200 z-10"
                aria-label="Delete item"
            >
                ×
            </button>
            {/* 아이콘 */}
            <span className="text-3xl mb-1" role="img" aria-label={item.name}>
                {item.icon || getCategoryEmoji(item.category)}
            </span>
            {/* 이름 */}
            <p className="text-xs text-gray-800 truncate w-full text-center font-medium">
                {item.name}
            </p>
            {/* 수량 */}
            <p className="text-xs text-gray-500">
                {item.quantity}개
            </p>
            {item.daysLeft !== null && item.daysLeft != undefined && (
                <p className={`text-xs font-semibold mt-1 ${getExpirationColor(item.daysLeft)}`}>
                    {getDaysLeftText(item.daysLeft)}
                </p>
            )}
        </div>
    );
};

export default Item;