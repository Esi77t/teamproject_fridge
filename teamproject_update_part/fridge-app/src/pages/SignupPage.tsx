import api from "@/api/api";
import { SignupRequest } from "@/types/user";
import { ChangeEvent, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Signup.css";

interface SignupErrors {
    userId?: string;
    password?: string;
    passwordConfirm?: string;
    nickname?: string;
    email?: string;
    submit?: string;
}

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignupRequest & { passwordConfirm: string }>({
        userId: '',
        nickname: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const [errors, setErrors] = useState<SignupErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name as keyof SignupErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (formData.password !== formData.passwordConfirm) {
            setErrors({ passwordConfirm: "비밀번호가 일치하지 않습니다." });
            return;
        }

        setLoading(true);
        setErrors({}); // 에러 초기화

        try {
            await api.post('/auth/signup', {
                userId: formData.userId,
                nickname: formData.nickname,
                email: formData.email,
                password: formData.password
            });

            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            navigate('/login');
            
        } catch (error: any) {
            setErrors({
                submit: error.response?.data?.message || '회원가입에 실패했습니다.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>회원가입</h2>
                {errors.submit && <div className="error-message" style={{ color: 'red' }}>{errors.submit}</div>}                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userId">아이디</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                            placeholder="4~20자 이내로 입력해주세요."
                        />
                        {errors.userId && <span className="field-error">{errors.userId}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="8~20자 이내로 입력해주세요."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordConfirm">비밀번호 확인</label>
                        <input
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                            placeholder="비밀번호를 다시 입력해주세요."
                        />
                        {errors.passwordConfirm && <span className="field-error" style={{ color: 'red' }}>{errors.passwordConfirm}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="nickname">닉네임</label>
                        <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            required
                            placeholder="2~20자 이내로 입력해주세요."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">이메일</label> 
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@email.com"
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? '회원가입 중...' : '회원가입'}
                    </button>
                </form>

                <div className="signup-footer">
                    <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;