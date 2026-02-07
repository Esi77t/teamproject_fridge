// 카테고리 타입
export type Category = 'vegetable' | 'meat' | 'other' | 'freezer';

// 냉장고 재료 타입
export interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    icon: string;
    createdAt: string;
    expirationDate?: string;
    daysLeft?: number;
}

// 장바구니 아이템 타입
export interface CartItem {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    createdAt: string;
    expirationDate?: string;
}

// Workspace API 응답 타입
export interface WorkspaceResponse {
    ingredients: Ingredient[];
    cartItems: CartItem[];
}

// 재료 추가 요청 타입
export interface AddIngredientRequest {
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    icon: string;
    expirationDate?: string;
}

// 장바구니 추가 요청 타입
export interface AddCartItemRequest {
    name: string;
    quantity: number;
    unit: string;
    category: Category;
    expirationDate?: string;
}

// 로그인 요청 타입
export interface LoginRequest {
    userId: string;
    password: string;
}

// 회원가입 요청 타입
export interface SignUpRequest {
    userId: string;
    password: string;
    nickname: string;
    email: string;
}

// 사용자 정보 타입
export interface User {
    id: number;
    userId: string;
    nickname: string;
    email: string;
    profileImageUrl?: string;
}

// 토큰 타입
export interface TokenDto {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn?: number;
}