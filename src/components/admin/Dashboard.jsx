import { useItems } from '../../hooks/useItems'
import { useCategories } from '../../hooks/useCategories'
import { Package, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { items } = useItems()
  const { categories } = useCategories()

  const totalItems = items.length
  const lowStock = items.filter(i => i.stock_quantity > 0 && i.stock_quantity <= 5).length
  const outOfStock = items.filter(i => i.stock_quantity === 0).length
  const available = items.filter(i => i.is_available).length

  return (
    <>
      <div className="content-header">
        <div>
          <h2>Beranda</h2>
          <p>Ringkasan stok toko kamu</p>
        </div>
      </div>
      <div className="content-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <h3>{totalItems}</h3>
              <p>Total Barang</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>{available}</h3>
              <p>Tersedia di Menu</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <h3>{lowStock}</h3>
              <p>Stok Menipis (≤5)</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>{outOfStock}</h3>
              <p>Stok Habis</p>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 700 }}>Stok per Kategori</h3>
        <div className="category-grid">
          {categories.map(cat => {
            const catItems = items.filter(i => i.category_id === cat.id)
            const catLow = catItems.filter(i => i.stock_quantity > 0 && i.stock_quantity <= 5).length
            return (
              <div key={cat.id} className="category-card">
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <h4>{cat.name}</h4>
                  <p>{catItems.length} barang · {catLow > 0 ? `${catLow} stok menipis` : 'Stok aman'}</p>
                </div>
              </div>
            )
          })}
        </div>

        {items.filter(i => i.stock_quantity <= 5 && i.stock_quantity > 0).length > 0 && (
          <>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 700, color: 'var(--warning)' }}>
              ⚠️ Peringatan Stok Menipis
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Barang</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter(i => i.stock_quantity <= 5 && i.stock_quantity > 0)
                    .sort((a, b) => a.stock_quantity - b.stock_quantity)
                    .map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-name-cell">
                            <div className="item-thumb">{item.categories?.icon || '📦'}</div>
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td><span className="badge badge-category">{item.categories?.name}</span></td>
                        <td><span className="badge badge-warning">{item.stock_quantity} tersisa</span></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  )
}
