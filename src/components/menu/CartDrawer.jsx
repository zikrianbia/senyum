import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'

export default function CartDrawer({ cart, totalItems, totalPrice, onAdd, onRemove, onClear, isOpen, onClose }) {
  const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

  const buildWhatsAppMessage = () => {
    let msg = '🛒 *Pesanan dari Kedai Senyum*\n\n'
    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} x${item.qty} — ${formatPrice(item.price * item.qty)}\n`
    })
    msg += `\n💰 *Total: ${formatPrice(totalPrice)}*`
    msg += '\n\nTerima kasih! 😊'
    return encodeURIComponent(msg)
  }

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingBag size={20} />
            <h3>Keranjang Belanja</h3>
            <span className="cart-badge-inline">{totalItems}</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Keranjang masih kosong</p>
              <span>Tambahkan item dari menu</span>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">{formatPrice(item.price)}</div>
                    </div>
                    <div className="cart-item-controls">
                      <button className="cart-qty-btn" onClick={() => onRemove(item.id)}>
                        {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span className="cart-qty-count">{item.qty}</span>
                      <button className="cart-qty-btn plus" onClick={() => onAdd(item)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="cart-clear-btn" onClick={onClear}>
                <Trash2 size={14} />
                Kosongkan Keranjang
              </button>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-price">{formatPrice(totalPrice)}</span>
            </div>
            <a
              href={`https://wa.me/6282184734885?text=${buildWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cart-wa-btn"
            >
              <MessageCircle size={18} />
              Pesan via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  )
}
