import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*, categories(name, icon)')
      .order('created_at', { ascending: false })

    if (!error) setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const addItem = async (item) => {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select('*, categories(name, icon)')
      .single()
    if (error) throw error
    setItems(prev => [data, ...prev])
    return data
  }

  const updateItem = async (id, updates) => {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select('*, categories(name, icon)')
      .single()
    if (error) throw error
    setItems(prev => prev.map(item => item.id === id ? data : item))
    return data
  }

  const deleteItem = async (id) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)
    if (error) throw error
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const adjustStock = async (id, adjustment) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    const newQty = Math.max(0, item.stock_quantity + adjustment)
    return updateItem(id, { stock_quantity: newQty })
  }

  return { items, loading, fetchItems, addItem, updateItem, deleteItem, adjustStock }
}
