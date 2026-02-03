import { Category } from './ingredient';

export interface CartItem {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    expirationDate?: string; // 장바구니에선 유통기한이 없을 수도 있음
}

// 장바구니에 담기 요청
export interface CartRequest {
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    expirationDate?: string;
}