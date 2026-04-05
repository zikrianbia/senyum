import { useState, useCallback } from 'react'

export function useCart() {
  const [cart, setCart] = useState([])

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) {
        return prev.map(c =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        )
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === itemId)
      if (existing && existing.qty > 1) {
        return prev.map(c =>
          c.id === itemId ? { ...c, qty: c.qty - 1 } : c
        )
      }
      return prev.filter(c => c.id !== itemId)
    })
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const getItemQty = useCallback((itemId) => {
    const item = cart.find(c => c.id === itemId)
    return item ? item.qty : 0
  }, [cart])

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0)
  const totalPrice = cart.reduce((sum, c) => sum + (c.price * c.qty), 0)

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
