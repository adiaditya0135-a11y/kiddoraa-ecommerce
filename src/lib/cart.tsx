import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { findColor, findPack, shippingFor } from '@/data/products'

export type CartLine = { packId: string; colorId: string; quantity: number }

type CartContextValue = {
  lines: Array<CartLine>
  count: number
  subtotal: number
  shipping: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (line: CartLine) => void
  setQuantity: (packId: string, colorId: string, quantity: number) => void
  remove: (packId: string, colorId: string) => void
  clear: () => void
}

const STORAGE_KEY = 'kiddoraa-cart'
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Array<CartLine>>([])
  const [loaded, setLoaded] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Browser storage is read only after hydration.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      if (Array.isArray(saved)) {
        setLines(saved.filter((l) => findPack(l.packId) && findColor(l.colorId) && l.quantity > 0))
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, loaded])

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.packId === line.packId && l.colorId === line.colorId)
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, quantity: Math.min(20, l.quantity + line.quantity) } : l,
        )
      }
      return [...prev, line].slice(-10)
    })
  }, [])

  const setQuantity = useCallback((packId: string, colorId: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.packId === packId && l.colorId === colorId
            ? { ...l, quantity: Math.max(0, Math.min(20, quantity)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    )
  }, [])

  const remove = useCallback((packId: string, colorId: string) => {
    setLines((prev) => prev.filter((l) => !(l.packId === packId && l.colorId === colorId)))
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + (findPack(l.packId)?.price ?? 0) * l.quantity, 0)
    return {
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal,
      shipping: shippingFor(subtotal),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear: () => setLines([]),
    }
  }, [lines, isOpen, add, setQuantity, remove])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
