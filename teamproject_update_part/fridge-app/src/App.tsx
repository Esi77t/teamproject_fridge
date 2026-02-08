import './App.css'
import { FridgeProvider } from './contexts/FridgeContext'
import RefrigeratorPage from './pages/RefrigeratorPage'
import DndWrapper from './components/Dndwrapper'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProtectedRoute from './components/Protetctedroute'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* 보호된 라우트 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FridgeProvider>
                  <DndWrapper>
                    <RefrigeratorPage />
                  </DndWrapper>
                </FridgeProvider>
              </ProtectedRoute>
            }
          />
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
