export interface User {
    userId: string;
    nickname: string;
    email: string;
    profileImageUrl?: string;
}

export interface LoginRequest {
    userId: string;
    password: string;
}

export interface SignupRequest {
    userId: string;
    nickname: string;
    password: string;
    email: string;
    profileImageUrl?: string;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}