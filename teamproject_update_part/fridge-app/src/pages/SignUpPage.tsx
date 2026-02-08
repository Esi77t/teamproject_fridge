import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

const SignUpPage = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 유효성 검사
        if (!formData.userId.trim() || !formData.password.trim() || !formData.nickname.trim() || !formData.email.trim()) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (formData.password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('올바른 이메일 형식이 아닙니다.');
            return;
        }

        try {
            setIsLoading(true);
            await signUp({
                userId: formData.userId,
                password: formData.password,
                nickname: formData.nickname,
                email: formData.email
            });
            navigate('/');
        } catch (err: any) {
            setError(err.message || '회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                {/* 로고 */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">냉장고 관리</h2>
                    <p className="text-gray-600 mt-2">새 계정을 만드세요</p>
                </div>
                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                {/* 회원가입 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            아이디
                        </label>
                        <Input
                            type="text"
                            name="userId"
                            placeholder="아이디를 입력하세요"
                            value={formData.userId}
                            onChange={handleChange}
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
                            name="password"
                            placeholder="비밀번호를 입력하세요 (최소 6자)"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호 확인
                        </label>
                        <Input
                            type="password"
                            name="passwordConfirm"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            닉네임
                        </label>
                        <Input
                            type="text"
                            name="nickname"
                            placeholder="닉네임을 입력하세요"
                            value={formData.nickname}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            이메일
                        </label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    >
                        {isLoading ? '가입 중...' : '회원가입'}
                    </Button>
                </form>
                {/* 로그인 링크 */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;