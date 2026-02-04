import { Ingredient, IngredientRequest } from "@/types/ingredient"
import api from "./api"

export const ingredientApi = {
    // 냉장고 목록 가져오기
    getIngredients: async () => {
        const response = await api.get<Ingredient[]>('/ingredients');
        return response.data;
    },

    // 재료 추가하기
    addIngredients: async (data: IngredientRequest) => {
        const response = await api.post<Ingredient>('/ingredients', data);
        return response.data;
    },

    // 장바구니로 이동
    moveToCart: async (id: number, moveQuantity: number) => {
        return await api.post(`/ingredients/${id}/move-to-cart`, null, {
            params: {moveQuantity}
        });
    }
};