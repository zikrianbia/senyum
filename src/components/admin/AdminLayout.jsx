import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Dashboard from './Dashboard'
import ItemManager from './ItemManager'
import CategoryManager from './CategoryManager'
import QRCodePage from './QRCodePage'
import { LayoutDashboard, Package, Tag, QrCode, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="login-page">
        <div className="loading-spinner"><div className="spinner" /></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">😊</div>
            <div>
              <h1>Senyum</h1>
              <span>Manajemen Stok</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard className="nav-icon" />
            Beranda
          </NavLink>
          <NavLink to="/admin/items" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package className="nav-icon" />
            Barang
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Tag className="nav-icon" />
            Kategori
          </NavLink>
          <NavLink to="/admin/qrcode" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <QrCode className="nav-icon" />
            Kode QR
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleSignOut}>
            <LogOut className="nav-icon" />
            Keluar
          </button>
        </div>
      </aside>

      <div className="main-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="items" element={<ItemManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="qrcode" element={<QRCodePage />} />
        </Routes>
      </div>
    </div>
  )
}
