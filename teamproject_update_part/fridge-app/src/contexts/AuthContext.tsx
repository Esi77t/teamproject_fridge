import { authApi } from "@/services/api";
import { LoginRequest, SignUpRequest, User } from "@/types";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signUp: (data: SignUpRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
           const response = await authApi.getCurrentUser();
           setUser(response.data);
        } catch (error) {
            setUser(null);
            localStorage.removeItem('accessToken');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(async (data: LoginRequest) => {
        try {
            await authApi.login(data);
            await checkAuth();
        } catch (error: any) {
            throw new Error(error.resposne?.data?.message || '로그인에 실패했습니다.');
        }
    }, [checkAuth]);

    const signUp = useCallback(async (data: SignUpRequest) => {
        try {
            await authApi.signUp(data);
            // 가입 후 자동로그인
            await login({ userId: data.userId, password: data.password });
        } catch (error: any) {
            throw new Error(error.resposne?.data?.message || '회원가입에 실패했습니다.');
        }
    }, [login]);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout Error: ', error);
        } finally {
            setUser(null);
            localStorage.removeItem('accessToken');
        }
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}