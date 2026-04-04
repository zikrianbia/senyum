import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { useItems } from '../../hooks/useItems'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function CategoryManager() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const { items } = useItems()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = async (cat) => {
    const catItems = items.filter(i => i.category_id === cat.id)
    if (catItems.length > 0) {
      toast.error(`Tidak bisa hapus "${cat.name}" — masih ada ${catItems.length} barang. Pindahkan atau hapus barangnya dulu.`)
      return
    }
    if (!confirm(`Hapus kategori "${cat.name}"?`)) return
    try {
      await deleteCategory(cat.id)
      toast.success('Kategori dihapus')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <div className="content-header">
        <div>
          <h2>Kategori</h2>
          <p>Kelompokkan barang berdasarkan jenis</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true) }}>
          <Plus size={18} />
          Tambah Kategori
        </button>
      </div>
      <div className="content-body">
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <div className="category-grid">
            {categories.map(cat => {
              const count = items.filter(i => i.category_id === cat.id).length
              return (
                <div key={cat.id} className="category-card">
                  <div className="cat-icon">{cat.icon}</div>
                  <div className="cat-info">
                    <h4>{cat.name}</h4>
                    <p>{count} barang · Urutan: {cat.sort_order}</p>
                  </div>
                  <div className="cat-actions">
                    <button className="btn btn-ghost btn-icon" onClick={() => { setEditing(cat); setShowModal(true) }}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(cat)} style={{ color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <CategoryFormModal
          category={editing}
          onSave={async (data) => {
            try {
              if (editing) {
                await updateCategory(editing.id, data)
                toast.success('Kategori diperbarui')
              } else {
                await addCategory(data)
                toast.success('Kategori ditambahkan')
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

function CategoryFormModal({ category, onSave, onClose }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    name_ms: category?.name_ms || '',
    icon: category?.icon || '📦',
    sort_order: category?.sort_order ?? 0,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...form, sort_order: parseInt(form.sort_order) || 0 })
    setSaving(false)
  }

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const emojiOptions = ['🍜', '🥤', '🚬', '💊', '🍫', '🍞', '🧊', '🍿', '🥫', '🧃', '🍪', '📦']

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{category ? 'Ubah Kategori' : 'Tambah Kategori'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Nama Kategori *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="cth. Makanan Ringan"
                required
              />
            </div>
            <div className="form-group">
              <label>Nama Alternatif</label>
              <input
                type="text"
                value={form.name_ms}
                onChange={e => update('name_ms', e.target.value)}
                placeholder="cth. Snack"
              />
            </div>
            <div className="form-group">
              <label>Ikon</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {emojiOptions.map(emoji => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => update('icon', emoji)}
                    style={{
                      fontSize: '24px',
                      padding: '8px',
                      borderRadius: '8px',
                      border: form.icon === emoji ? '2px solid var(--primary)' : '2px solid var(--border)',
                      background: form.icon === emoji ? 'rgba(249,115,22,0.1)' : 'var(--bg-input)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Urutan Tampil</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={e => update('sort_order', e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : (category ? 'Perbarui' : 'Tambah Kategori')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
