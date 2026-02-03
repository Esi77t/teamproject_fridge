export interface User {
    userId: string;
    nickname: string;
    email: string;
    profileImageUrl?: string;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}