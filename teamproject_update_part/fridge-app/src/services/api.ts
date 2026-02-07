import axios, { InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

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
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                api.post('/auth/refresh')
                    .then(() => {
                        processQueue(null);
                        resolve(api(originalRequest));
                    })
                    .catch((reissueError) => {
                        processQueue(reissueError, null);
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