import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import AdminLayout from './components/admin/AdminLayout'
import Login from './components/admin/Login'
import MenuPage from './components/menu/MenuPage'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1d27',
              color: '#f1f5f9',
              border: '1px solid #2a2d3a',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#1a1d27' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1a1d27' },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
