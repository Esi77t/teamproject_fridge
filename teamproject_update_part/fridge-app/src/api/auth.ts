import { LoginRequest, SignupRequest, User } from "@/types/user";
import api from "./api";

export const login = async (userData: LoginRequest): Promise<User> => {
    const response = await api.post<User>('/auth/login', userData);
    return response.data;
}

export const signup = async (userData: SignupRequest): Promise<User> => {
    const response = await api.post<User>('/auth/signup', userData);
    return response.data;
}