import './App.css'
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';

function App() {
    return (
        <div className='app-container'>
            <main className='main-content'>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
                </Routes>
            </main>
        </div>
    );
}

export default App
