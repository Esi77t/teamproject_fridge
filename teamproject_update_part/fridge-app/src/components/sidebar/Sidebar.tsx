import { useState } from 'react';
import { useFridge } from '@/contexts/FridgeContext';
import { Category } from '@/types';
import { useDroppable } from '@dnd-kit/core';
import { getCategoryEmoji, getCategoryTitle } from '@/utils/constants';
import CartItemList from './CartItemList';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const Sidebar = () => {
    const { addIngredient, cartItems } = useFridge();
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    const [newItemCategory, setNewItemCategory] = useState<Category>('vegetable');
    const [newItemExpirationDate, setNewItemExpirationDate] = useState('');     // 유통기한(선택사항)

    // 장바구니를 드롭 영역으로 만들기
    const { setNodeRef, isOver } = useDroppable({
        id: 'cart-drop-zone',
    });

    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            alert('재료 이름을 입력해주세요!');
            return;
        }

        try {
            const icon = getCategoryEmoji(newItemCategory);
            await addIngredient(newItemName.trim(), newItemQuantity, newItemCategory, icon);

            // 입력 필드 초기화
            setNewItemName('');
            setNewItemQuantity(1);
            setNewItemCategory('vegetable');
            setNewItemExpirationDate('');
        } catch (error) {
            alert('재료 추가에 실패했습니다.');
        }
    };

    const categories: Category[] = ['vegetable', 'meat', 'other', 'freezer'];

    return (
        <div className="w-80 bg-gradient-to-b from-orange-500 to-orange-600 text-white p-6 flex flex-col rounded-l-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">재료 관리</h2>

            {/* 새 재료 추가 섹션 */}
            <div className="mb-8 p-4 bg-orange-700/50 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-3">새 재료 추가</h3>
                <Input
                    type="text"
                    placeholder="재료 이름"
                    className="w-full mb-3 bg-white/90 text-gray-800 placeholder:text-gray-500"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <Input
                    type="number"
                    placeholder="수량"
                    className="w-full mb-3 bg-white/90 text-gray-800"
                    min="1"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                />
                <Input
                    type="date"
                    placeholder="유통기한 (선택)"
                    className="w-full mb-3 bg-white/90 text-gray-800"
                    value={newItemExpirationDate}
                    onChange={(e) => setNewItemExpirationDate(e.target.value)}
                />
                <Select value={newItemCategory} onValueChange={(value) => setNewItemCategory(value as Category)}>
                    <SelectTrigger className="w-full mb-3 bg-white/90 text-gray-800">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {getCategoryEmoji(category)} {getCategoryTitle(category)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    onClick={handleAddItem}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    냉장고에 추가
                </Button>
            </div>
            {/* 장바구니 섹션 */}
            <div
                ref={setNodeRef}
                className={`flex-1 p-4 bg-orange-700/50 rounded-lg overflow-y-auto transition-colors ${isOver ? 'ring-4 ring-blue-400 bg-blue-600/30' : ''
                    }`}
            >
                <h3 className="text-lg font-semibold mb-3">
                    장바구니 ({cartItems.length})
                </h3>
                {cartItems.length === 0 ? (
                    <p className="text-sm text-orange-200 text-center mt-8">
                        장바구니가 비어있습니다.
                        <br />
                        냉장고에서 재료를 드래그해보세요!
                    </p>
                ) : (
                    <CartItemList items={cartItems} />
                )}
            </div>
        </div>
    );
};

export default Sidebar;