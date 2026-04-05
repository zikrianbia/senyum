import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import CartDrawer from './CartDrawer'

export default function MenuPage() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(null)
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  const {
    cart, addToCart, removeFromCart, clearCart,
    getItemQty, totalItems, totalPrice,
  } = useCart()

  useEffect(() => {
    async function fetchData() {
      const [catRes, itemRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('items').select('*, categories(name, icon)').eq('is_available', true).order('name'),
      ])
      setCategories(catRes.data || [])
      setItems(itemRes.data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = !activeCategory || item.category_id === activeCategory
    return matchSearch && matchCat
  })

  const groupedItems = categories
    .filter(cat => {
      if (activeCategory && cat.id !== activeCategory) return false
      return filtered.some(item => item.category_id === cat.id)
    })
    .map(cat => ({
      ...cat,
      items: filtered.filter(item => item.category_id === cat.id)
    }))

  if (loading) {
    return (
      <div className="menu-page">
        <div className="menu-hero">
          <h1>Kedai Senyum</h1>
          <p>Memuat menu...</p>
        </div>
        <div className="menu-container">
          <div className="loading-spinner"><div className="spinner" style={{ borderColor: '#e7e5e4', borderTopColor: '#f97316' }} /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <h1>😊 Kedai Senyum</h1>
        <p>Selamat datang! Yuk lihat menu kami</p>
      </div>

      <div className="menu-container">
        <div className="menu-header-sticky">
          <div className="menu-search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="menu-categories">
            <button
              className={`category-pill ${!activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              <span className="pill-icon">🏪</span>
              Semua
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              >
                <span className="pill-icon">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {groupedItems.length === 0 ? (
          <div className="menu-empty">
            <div className="empty-emoji">🔍</div>
            <h3>Tidak ditemukan</h3>
            <p>Coba kata kunci atau kategori lain</p>
          </div>
        ) : (
          groupedItems.map(cat => (
            <div key={cat.id} className="menu-section">
              <div className="menu-section-title">
                <span className="section-icon">{cat.icon}</span>
                <h2>{cat.name}</h2>
                <span className="section-count">{cat.items.length}</span>
              </div>
              <div className="menu-items-grid">
                {cat.items.map(item => {
                  const qty = getItemQty(item.id)
                  const outOfStock = item.stock_quantity === 0

                  return (
                    <div
                      key={item.id}
                      className={`menu-item-card ${outOfStock ? 'unavailable' : ''}`}
                    >
                      <div className="item-image">
                        {cat.icon}
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        {item.description && (
                          <div className="item-desc">{item.description}</div>
                        )}
                        {outOfStock && (
                          <div className="unavailable-badge">Stok habis</div>
                        )}
                      </div>
                      <div className="item-price">
                        Rp {Number(item.price).toLocaleString('id-ID')}
                      </div>

                      {/* Cart Controls */}
                      {!outOfStock && (
                        <div className="item-cart-controls">
                          {qty > 0 ? (
                            <div className="item-qty-group">
                              <button
                                className="item-qty-btn minus"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="item-qty-count">{qty}</span>
                              <button
                                className="item-qty-btn plus"
                                onClick={() => addToCart(item)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="item-add-btn"
                              onClick={() => addToCart(item)}
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="menu-footer">
        Dibuat oleh <span>Kedai Senyum</span> · Diperbarui secara langsung
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button className="floating-cart-btn" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={22} />
          <span className="floating-cart-badge">{totalItems}</span>
          <div className="floating-cart-info">
            <span className="floating-cart-label">{totalItems} item</span>
            <span className="floating-cart-price">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </button>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClear={clearCart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  )
}
