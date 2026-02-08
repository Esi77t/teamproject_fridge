import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Ingredient, CartItem, Category, AddIngredientRequest } from '@/types';
import { workspaceApi, ingredientApi, cartApi } from '@/services/api';
import { getCategoryEmoji } from '@/utils/constants';

interface FridgeContextType {
    // 상태
    ingredients: Ingredient[];
    cartItems: CartItem[];
    isLoading: boolean;
    error: string | null;

    // 냉장고 관련
    addIngredient: (name: string, quantity: number, category: Category, icon?: string, expirationDate?: string) => Promise<void>;
    removeIngredient: (id: number) => Promise<void>;
    moveIngredientToCart: (id: number, moveQuantity: number) => Promise<void>;
    updateIngredientCategory: (id: number, category: Category) => Promise<void>;

    // 장바구니 관련
    addCartItem: (name: string, quantity: number, category: Category, expirationDate?: string) => Promise<void>;
    removeCartItem: (id: number) => Promise<void>;
    moveCartItemToFridge: (id: number, category: Category) => Promise<void>;

    // 데이터 새로고침
    refreshData: () => Promise<void>;
}

const FridgeContext = createContext<FridgeContextType | undefined>(undefined);

export const useFridge = () => {
    const context = useContext(FridgeContext);
    if (!context) {
        throw new Error('useFridge must be used within FridgeProvider');
    }
    return context;
};

interface FridgeProviderProps {
    children: ReactNode;
}

export const FridgeProvider = ({ children }: FridgeProviderProps) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 초기 데이터 로드
    const refreshData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await workspaceApi.getWorkspace();
            setIngredients(response.data.ingredients || []);
            setCartItems(response.data.cartItems || []);
        } catch (err) {
            setError('데이터를 불러오는데 실패했습니다.');
            console.error('Failed to fetch workspace data:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // 재료 추가
    const addIngredient = useCallback(async (
        name: string,
        quantity: number,
        category: Category,
        icon?: string,
        expirationDate?: string,
    ) => {
        try {
            const data: AddIngredientRequest = {
                name,
                quantity,
                category,
                icon: icon || getCategoryEmoji(category),
                unit: '개',
                expirationDate,
            };

            const response = await ingredientApi.add(data);
            setIngredients((prev) => [...prev, response.data]);
        } catch (err) {
            console.error('Failed to add ingredient:', err);
            throw err;
        }
    }, []);

    // 재료 삭제
    const removeIngredient = useCallback(async (id: number) => {
        try {
            await ingredientApi.delete(id);
            setIngredients((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error('Failed to remove ingredient:', err);
            throw err;
        }
    }, []);

    // 재료 → 장바구니
    const moveIngredientToCart = useCallback(async (id: number, moveQuantity: number) => {
        // 낙관적 업데이트: 먼저 UI 업데이트
        const itemToMove = ingredients.find((item) => item.id === id);
        if (!itemToMove) return;

        // UI에서 즉시 제거
        setIngredients((prev) => prev.filter((item) => item.id !== id));

        // 장바구니에 즉시 추가
        const newCartItem = {
            ...itemToMove,
            id: Date.now(), // 임시 ID
        };
        setCartItems((prev) => [...prev, newCartItem]);

        try {
            // 백엔드 API 호출
            await ingredientApi.moveToCart(id, moveQuantity);
            // 성공 시 최신 데이터로 동기화
            await refreshData();
        } catch (err) {
            // 실패 시 롤백
            console.error('Failed to move ingredient to cart:', err);
            await refreshData(); // 원래 상태로 복구
            throw err;
        }
    }, [ingredients, refreshData]);

    // 재료 카테고리 변경 (냉장고 내 이동)
    const updateIngredientCategory = useCallback(async (id: number, category: Category) => {
        try {
            const response = await ingredientApi.updateCategory(id, category);
            setIngredients((prev) =>
                prev.map((item) => (item.id === id ? response.data : item))
            );
        } catch (err) {
            console.error('Failed to update ingredient category:', err);
            throw err;
        }
    }, []);

    // 장바구니 추가
    const addCartItem = useCallback(async (
        name: string,
        quantity: number,
        category: Category
    ) => {
        try {
            const data = {
                name,
                quantity,
                category,
                unit: '개',
            };

            const response = await cartApi.add(data);
            setCartItems((prev) => [...prev, response.data]);
        } catch (err) {
            console.error('Failed to add cart item:', err);
            throw err;
        }
    }, []);

    // 장바구니 삭제
    const removeCartItem = useCallback(async (id: number) => {
        try {
            await cartApi.delete(id);
            setCartItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error('Failed to remove cart item:', err);
            throw err;
        }
    }, []);

    // 장바구니 → 냉장고
    const moveCartItemToFridge = useCallback(async (id: number, category: Category) => {
        // 낙관적 업데이트: 먼저 UI 업데이트
        const itemToMove = cartItems.find((item) => item.id === id);
        if (!itemToMove) return;

        // 장바구니에서 즉시 제거
        setCartItems((prev) => prev.filter((item) => item.id !== id));

        // 냉장고에 즉시 추가
        const newIngredient = {
            ...itemToMove,
            category,
            icon: getCategoryEmoji(category),
            daysLeft: itemToMove.expirationDate
                ? Math.ceil((new Date(itemToMove.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : undefined,
            id: Date.now(), // 임시 ID
        };
        setIngredients((prev) => [...prev, newIngredient]);

        try {
            // 백엔드 API 호출
            await cartApi.moveToFridge(id, category);
            // 성공 시 최신 데이터로 동기화
            await refreshData();
        } catch (err) {
            // 실패 시 롤백
            console.error('Failed to move cart item to fridge:', err);
            await refreshData(); // 원래 상태로 복구
            throw err;
        }
    }, [cartItems, refreshData]);

    const value: FridgeContextType = {
        ingredients,
        cartItems,
        isLoading,
        error,
        addIngredient,
        removeIngredient,
        moveIngredientToCart,
        updateIngredientCategory,
        addCartItem,
        removeCartItem,
        moveCartItemToFridge,
        refreshData,
    };

    return <FridgeContext.Provider value={value}>{children}</FridgeContext.Provider>;
};