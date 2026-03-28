import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MenuItem {
  itemId: number
  itemName: string
  description: string
  price: number
  quantity: number
}

interface CartState {
  items: MenuItem[]
  restaurantId: string | null
  restaurantName: string | null
  total: number
}

const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: MenuItem; restaurantId: string; restaurantName: string }>) => {
      // Clear cart if different restaurant
      if (state.restaurantId && state.restaurantId !== action.payload.restaurantId) {
        state.items = []
      }

      state.restaurantId = action.payload.restaurantId
      state.restaurantName = action.payload.restaurantName

      const existingItem = state.items.find(i => i.itemId === action.payload.item.itemId)
      if (existingItem) {
        existingItem.quantity += action.payload.item.quantity
      } else {
        state.items.push(action.payload.item)
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.itemId !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = null
      }
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      const item = state.items.find(i => i.itemId === action.payload.itemId)
      if (item) {
        item.quantity = action.payload.quantity
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.restaurantId = null
      state.restaurantName = null
      state.total = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

