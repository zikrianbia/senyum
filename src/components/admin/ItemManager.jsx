import { useState } from 'react'
import { useItems } from '../../hooks/useItems'
import { useCategories } from '../../hooks/useCategories'
import toast from 'react-hot-toast'
import { Plus, Search, Pencil, Trash2, Minus } from 'lucide-react'

export default function ItemManager() {
  const { items, loading, addItem, updateItem, deleteItem, adjustStock } = useItems()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || item.category_id === filterCat
    return matchSearch && matchCat
  })

  const handleDelete = async (item) => {
    if (!confirm(`Hapus "${item.name}"?`)) return
    try {
      await deleteItem(item.id)
      toast.success('Barang dihapus')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleAdjust = async (id, delta) => {
    try {
      await adjustStock(id, delta)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleToggle = async (item) => {
    try {
      await updateItem(item.id, { is_available: !item.is_available })
      toast.success(item.is_available ? 'Disembunyikan dari menu' : 'Ditampilkan di menu')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const openEdit = (item) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const openAdd = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  return (
    <>
      <div className="content-header">
        <div>
          <h2>Barang</h2>
          <p>Kelola stok barang toko kamu</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} />
          Tambah Barang
        </button>
      </div>
      <div className="content-body">
        <div className="toolbar">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari barang..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Belum ada barang</h3>
            <p>{search || filterCat ? 'Coba ubah filter pencarian' : 'Mulai dengan menambahkan barang pertama'}</p>
            {!search && !filterCat && (
              <button className="btn btn-primary" onClick={openAdd}>
                <Plus size={18} /> Tambah Barang
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Barang</th>
                  <th>Kategori</th>
                  <th>Harga (Rp)</th>
                  <th>Stok</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-name-cell">
                        <div className="item-thumb">{item.categories?.icon || '📦'}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          {item.description && (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label="Kategori">
                      <span className="badge badge-category">{item.categories?.name || '—'}</span>
                    </td>
                    <td data-label="Harga" style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                        Rp {Number(item.price).toLocaleString('id-ID')}
                        <button
                          className="btn btn-ghost btn-icon"
                          style={{ padding: '4px', opacity: 0.5 }}
                          onClick={() => openEdit(item)}
                          title="Ubah Harga"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    </td>
                    <td data-label="Stok">
                      <div className="stock-control" style={{ justifyContent: 'flex-end' }}>
                        <button onClick={() => handleAdjust(item.id, -1)} title="Kurangi">
                          <Minus size={14} />
                        </button>
                        <span className={item.stock_quantity === 0 ? 'badge badge-danger' : item.stock_quantity <= 5 ? 'badge badge-warning' : ''}>
                          {item.stock_quantity}
                        </span>
                        <button onClick={() => handleAdjust(item.id, 1)} title="Tambah">
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td data-label="Status">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={item.is_available}
                          onChange={() => handleToggle(item)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                    <td data-label="Opsi">
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(item)} title="Ubah">
                          <Pencil size={16} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(item)} title="Hapus" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ItemFormModal
          item={editingItem}
          categories={categories}
          onSave={async (data) => {
            try {
              if (editingItem) {
                await updateItem(editingItem.id, data)
                toast.success('Barang diperbarui')
              } else {
                await addItem(data)
                toast.success('Barang ditambahkan')
              }
              setShowModal(false)
            } catch (err) {
              toast.error(err.message)
            }
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

function ItemFormModal({ item, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category_id: item?.category_id || (categories[0]?.id || ''),
    price: item?.price || '',
    stock_quantity: item?.stock_quantity ?? 0,
    unit: item?.unit || 'pcs',
    is_available: item?.is_available ?? true,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      stock_quantity: parseInt(form.stock_quantity) || 0,
    })
    setSaving(false)
  }

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Ubah Barang' : 'Tambah Barang Baru'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Nama Barang *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="cth. Nasi Goreng"
                required
              />
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Deskripsi barang (opsional)"
              />
            </div>
            <div className="form-group">
              <label>Kategori *</label>
              <select
                value={form.category_id}
                onChange={e => update('category_id', e.target.value)}
                required
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Harga (Rp) *</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={form.price}
                  onChange={e => update('price', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Jumlah Stok</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={e => update('stock_quantity', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Satuan</label>
                <select value={form.unit} onChange={e => update('unit', e.target.value)}>
                  <option value="pcs">Buah (pcs)</option>
                  <option value="bungkus">Bungkus</option>
                  <option value="botol">Botol</option>
                  <option value="kaleng">Kaleng</option>
                  <option value="kotak">Kotak</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="porsi">Porsi</option>
                  <option value="gelas">Gelas</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.is_available}
                    onChange={e => update('is_available', e.target.checked)}
                  />
                  Tampilkan di menu
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : (item ? 'Perbarui Barang' : 'Tambah Barang')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
