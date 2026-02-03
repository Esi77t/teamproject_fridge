export type Category = '냉장' | '냉동' | '상온' | '기타';

export interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    expirationDate: string; // "2024-05-20" 형태의 문자열
    daysLeft: number;       // 백엔드에서 계산해서 보내주는 값 (D-Day)
    icon?: string;          // 재료 아이콘
}

// 재료 생성/수정 시 서버에 보낼 데이터 형식
export interface IngredientRequest {
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    expirationDate: string;
    icon?: string;
}