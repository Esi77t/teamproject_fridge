import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!userId.trim() || !password.trim()) {
            setError('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            await login({ userId, password });
            navigate('/');
        } catch (err: any) {
            setError(err.message || '로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                {/* 로고 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🧊</h1>
                    <h2 className="text-2xl font-bold text-gray-800">냉장고 관리</h2>
                    <p className="text-gray-600 mt-2">로그인하여 시작하세요</p>
                </div>
                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                {/* 로그인 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            아이디
                        </label>
                        <Input
                            type="text"
                            placeholder="아이디를 입력하세요"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호
                        </label>
                        <Input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>
                {/* 회원가입 링크 */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        계정이 없으신가요?{' '}
                        <Link
                            to="/signup"
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;