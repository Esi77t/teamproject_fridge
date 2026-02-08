import { AddCartItemRequest, AddIngredientRequest, CartItem, Ingredient, LoginRequest, SignUpRequest, User, WorkspaceResponse } from '@/types';
import axios, { InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface QueueTime {
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
}

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: QueueTime[] = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // 401 에러이고 재시도 전이며, 로그인/회원가입 요청이 아닌 경우에만 Refresh 시도
        const isAuthRequest = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/signup');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {

            // 이미 다른 요청이 토큰을 갱신 중이라면 큐에서 대기
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                api.post('/auth/refresh')
                    .then((res) => {
                        const newAccessToken = res.data.accessToken;

                        if (newAccessToken) {
                            localStorage.setItem('accessToken', newAccessToken);
                            processQueue(null, newAccessToken);
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        } else {
                            processQueue(null);
                        }

                        resolve(api(originalRequest));
                    })
                    .catch((reissueError) => {
                        processQueue(reissueError, null);
                        localStorage.removeItem('accessToken');
                        // Refresh Token마저 만료된 경우
                        console.error("세션 만료. 다시 로그인하세요.");
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        reject(reissueError);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        // 로그인/회원가입 실패 시 혹은 기타 에러는 그대로 reject
        return Promise.reject(error);
    }
);

// 냉장고 재료, 장바구니 재료 한 번에 가져올 API
export const workspaceApi = {
    getWorkspace: () => api.get<WorkspaceResponse>('/workspace'),
}

export const ingredientApi = {
    // 모든 재료 조회
    getAll: () => api.get<Ingredient[]>('/ingredients'),

    // 재료 추가
    add: (data: AddIngredientRequest) => api.post<Ingredient>('/ingredients', data),

    // 재료 삭제
    delete: (id: number) => api.delete(`/ingredients/${id}`),

    // 재료 카테고리 변경
    updateCategory: (id: number, category: string) =>
        api.patch<Ingredient>(`/ingredients/${id}/category`, { category }),

    // 재료 → 장바구니 이동
    moveToCart: (id: number, moveQuantity: number) =>
        api.post<void>(`/ingredients/${id}/move-to-cart`, null, { params: { moveQuantity } }),
};

export const cartApi = {
    // 장바구니 조회
    getAll: () => api.get<CartItem[]>('/cart'),

    // 장바구니 추가
    add: (data: AddCartItemRequest) => api.post<CartItem>('/cart', data),

    // 장바구니 삭제
    delete: (id: number) => api.delete(`/cart/${id}`),

    // 장바구니 → 냉장고 이동
    moveToFridge: (id: number, category: string) =>
        api.post<void>(`/cart/${id}/move`, null, { params: { category } }),
};

export const authApi = {
    // 로그인
    login: (data: LoginRequest) => api.post<string>('/auth/login', data),

    // 회원가입
    signUp: (data: SignUpRequest) => api.post<User>('/auth/signup', data),

    // 로그아웃
    logout: () => api.post<string>('/auth/logout'),

    // 현재 사용자 정보
    getCurrentUser: () => api.get<User>('/auth/me'),

    // 토큰 갱신
    refresh: () => api.post<string>('/auth/refresh'),
};

export default api;