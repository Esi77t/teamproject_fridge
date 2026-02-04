// 카테고리 정의
export type IngredientCategory = 'vegetable' | 'meat' | 'other' | 'freezer';

// 아이템 출처 정의
export type ItemSource = 'cart' | 'fridge';

// 드래그 아이템 인터페이스 (React DnD용)
export interface DragItem {
  id: number;
  category: IngredientCategory;
  sourceType: ItemSource;
  name?: string;
}