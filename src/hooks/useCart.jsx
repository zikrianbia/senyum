import { useState, useCallback, useEffect } from 'react'

const CART_STORAGE_KEY = 'kedai_senyum_cart'

export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error('Failed to load cart from storage:', e)
      return []
    }
  })

  // Persist to storage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) {
        return prev.map(c =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        )
      }
      return [...prev, { ...item, qty: 1, name: item.name, price: item.price }]
    })
  }, [])

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const existingItem = prev.find(c => c.id === itemId)
      if (existingItem) {
        if (existingItem.qty > 1) {
          return prev.map(c =>
            c.id === itemId ? { ...c, qty: c.qty - 1 } : c
          )
        }
        return prev.filter(c => c.id !== itemId)
      }
      return prev
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }, [])

  const getItemQty = useCallback((itemId) => {
    const item = cart.find(c => c.id === itemId)
    return item ? item.qty : 0
  }, [cart])

  const totalItems = cart.reduce((sum, c) => sum + (Number(c.qty) || 0), 0)
  const totalPrice = cart.reduce((sum, c) => sum + ((Number(c.price) || 0) * (Number(c.qty) || 0)), 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getItemQty,
    totalItems,
    totalPrice,
  }
}
