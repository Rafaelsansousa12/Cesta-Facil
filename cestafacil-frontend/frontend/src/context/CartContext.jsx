import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const FRETE_GRATIS_ACIMA = 200
const VALOR_FRETE = 15

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.item.id)
      if (exists) {
        return { ...state, items: state.items.map(i =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i.id !== action.id) }
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) }
    case 'CLEAR':
      return { items: [] }
    case 'LOAD':
      return { items: action.items }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    try {
      const saved = sessionStorage.getItem('cf_cart')
      return saved ? JSON.parse(saved) : { items: [] }
    } catch { return { items: [] } }
  })

  useEffect(() => {
    sessionStorage.setItem('cf_cart', JSON.stringify(state))
  }, [state])

  const subtotal = state.items.reduce((acc, i) => acc + i.precoEfetivo * i.qty, 0)
  const frete    = subtotal >= FRETE_GRATIS_ACIMA ? 0 : (subtotal > 0 ? VALOR_FRETE : 0)
  const total    = subtotal + frete
  const count    = state.items.reduce((acc, i) => acc + i.qty, 0)

  const addItem    = item   => dispatch({ type: 'ADD', item })
  const removeItem = id     => dispatch({ type: 'REMOVE', id })
  const updateQty  = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart  = ()    => dispatch({ type: 'CLEAR' })

  return (
    <CartContext.Provider value={{
      items: state.items, subtotal, frete, total, count,
      addItem, removeItem, updateQty, clearCart,
      freteGratis: FRETE_GRATIS_ACIMA,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
