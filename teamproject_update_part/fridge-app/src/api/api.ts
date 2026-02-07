import { CONFIG } from "@/config";
import axios, { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    withCredentials: true,
});

// // 요청 인터셉터: 로컬 스토리지에서 토큰을 꺼내 헤더에 넣음
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });



// localStorage를 쓸 일이 없으므로 다른거로
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // 401 에러시 재발급 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch (reissueError) {
                window.location.href = '/login';
                return Promise.reject(reissueError);
            }
        }
        return Promise.reject(error);
    }
)

export default api;