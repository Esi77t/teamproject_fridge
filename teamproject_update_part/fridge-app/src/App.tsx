import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './api/api'

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response =  await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('로그인 정보 없음');
            };
        }

        checkLogin();
    }, []);

    return (
        <>
        </>
    )
}

export default App
