import "./css/Login.css";
import api from "@/api/api";
import { LoginRequest } from "@/types/user";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginRequest>({
        userId: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/login', formData);
            navigate('/ingredients');
        } catch (error: any) {
            setError(error.response?.data?.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>로그인</h2>                
                {error && <div className="error-message">{error}</div>}                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userId">아이디</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                <div className="login-footer">
                    계정이 없으신가요? <Link to="/signup">회원가입</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;