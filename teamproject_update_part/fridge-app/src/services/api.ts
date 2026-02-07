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

api.interceptors.response.use(
    (response) => response,     // 성공하면 그대로 반환하고
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // 401 에러가 발생했고 아직 재시도를 하지 않았다면
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // 재시도 표시(무한루프 방지용)

            try {
                // /auth/refresh 엔드포인트 호출
                await api.post('/auth/refresh');

                // 재발급 성공시 실패했던 원래 요청 다시 시도
                return api(originalRequest);
            } catch (reissueError) {
                // 재발급 실패 시 로그인페이지로 이동
                console.error("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = '/login';
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
)