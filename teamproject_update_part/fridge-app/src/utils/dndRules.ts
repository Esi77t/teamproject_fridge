import { IngredientCategory } from "@/types/fridge";

export const canMoveItem = (
    currentCategory: IngredientCategory,
    targetCategory: IngredientCategory
): boolean => {
    // 규칙 1: '냉동' 재료는 어디든 갈수 있음
    if (currentCategory === 'freezer') return true;

    // 규칙 2: 모든 재료는 냉동칸으로 갈 수 있음
    if (targetCategory === 'freezer') return true;

    // 규칙 3: 그 외에는 같은 카테고리끼리만 이동 가능
    return currentCategory === targetCategory;
}