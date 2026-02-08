import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState, ReactNode } from 'react';
import { useFridge } from '@/contexts/FridgeContext';
import { Ingredient, CartItem, Category } from '@/types';

interface DndWrapperProps {
    children: ReactNode;
}

const DndWrapper = ({ children }: DndWrapperProps) => {
    const { moveCartItemToFridge, moveIngredientToCart, updateIngredientCategory } = useFridge();
    const [activeItem, setActiveItem] = useState<Ingredient | CartItem | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveItem(active.data.current?.item || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveItem(null);

        if (!over) return;

        const dragData = active.data.current;
        const dropData = over.data.current;

        // 장바구니 아이템 → 냉장고 섹션
        if (dragData?.type === 'cart-item' && dropData?.type === 'fridge-section') {
            const cartItem = dragData.item as CartItem;
            const targetCategory = dropData.category as Category;

            try {
                await moveCartItemToFridge(cartItem.id, targetCategory);
            } catch (error) {
                console.error('Failed to move cart item to fridge:', error);
                alert('이동에 실패했습니다.');
            }
        }

        // 냉장고 아이템 → 장바구니
        if (dragData?.type === 'ingredient' && over.id === 'cart-drop-zone') {
            const ingredient = dragData.item as Ingredient;

            try {
                await moveIngredientToCart(ingredient.id, ingredient.quantity);
            } catch (error) {
                console.error('Failed to move ingredient to cart:', error);
                alert('이동에 실패했습니다.');
            }
        }

        // 냉장고 아이템 → 다른 냉장고 섹션
        if (dragData?.type === 'ingredient' && dropData?.type === 'fridge-section') {
            const ingredient = dragData.item as Ingredient;
            const targetCategory = dropData.category as Category;

            // 같은 카테고리면 무시
            if (ingredient.category === targetCategory) return;

            try {
                await updateIngredientCategory(ingredient.id, targetCategory);
            } catch (error) {
                console.error('Failed to update ingredient category:', error);
                alert('카테고리 이동에 실패했습니다.');
            }
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {children}
            {/* 드래그 중인 아이템 미리보기 */}
            <DragOverlay>
                {activeItem && (
                    <div className="bg-white p-3 rounded-lg shadow-2xl border-2 border-blue-400 opacity-90">
                        <p className="font-bold text-gray-800">{activeItem.name}</p>
                        <p className="text-sm text-gray-600">수량: {activeItem.quantity}</p>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default DndWrapper;