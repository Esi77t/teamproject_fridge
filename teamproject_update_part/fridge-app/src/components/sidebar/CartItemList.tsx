import { useFridge } from '@/contexts/FridgeContext';
import { CartItem } from '@/types';
import { calculateDaysLeft, formatDate, getCategoryEmoji, getCategoryTitle, getDaysLeftText, getExpirationColor } from '@/utils/constants';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../ui/button';

interface CartItemDisplayProps {
    item: CartItem;
}

const CartItemDisplay = ({ item }: CartItemDisplayProps) => {
    const { removeCartItem } = useFridge();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `cart-${item.id}`,
        data: {
            type: 'cart-item',
            item,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = async () => {
        if (window.confirm(`${item.name}을(를) 삭제하시겠습니까?`)) {
            try {
                await removeCartItem(item.id);
            } catch (error) {
                alert('삭제에 실패했습니다.');
            }
        }
    };

    // 유통기한 계산
    const daysLeft = item.expirationDate ? calculateDaysLeft(item.expirationDate) : null;

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-orange-800/60 p-3 rounded-md mb-2 cursor-grab active:cursor-grabbing ${isDragging ? 'ring-2 ring-orange-400' : ''
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getCategoryEmoji(item.category)}</span>
                        <span className="font-semibold">{item.name}</span>
                    </div>
                    <p className="text-xs text-orange-200">
                        수량: {item.quantity} | 카테고리: {getCategoryTitle(item.category)}
                    </p>
                    <p className="text-xs text-orange-200">
                        담은 날짜: {formatDate(item.createdAt)}
                    </p>
                    {item.expirationDate && daysLeft !== null && (
                        <p className={`text-xs font-semibold mt-1 ${getExpirationColor(daysLeft)}`}>
                            유통기한: {getDaysLeftText(daysLeft)}
                        </p>
                    )}
                </div>
            </div>
            <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="w-full mt-2"
            >
                삭제
            </Button>
        </li>
    );
};

interface CartItemListProps {
    items: CartItem[];
}

const CartItemList = ({ items }: CartItemListProps) => {
    // 카테고리별로 그룹화
    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, CartItem[]>);

    return (
        <ul className="space-y-2">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category}>
                    {categoryItems.map((item) => (
                        <CartItemDisplay key={item.id} item={item} />
                    ))}
                </div>
            ))}
        </ul>
    );
};

export default CartItemList;