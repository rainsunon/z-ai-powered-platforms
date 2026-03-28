import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Restaurant {
  id: string
  name: string
  description?: string
  rating?: string
  address?: string
  menuList?: any[]
}

interface RestaurantState {
  restaurants: Restaurant[]
  selectedRestaurant: Restaurant | null
  loading: boolean
  error: string | null
}

const initialState: RestaurantState = {
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
}

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload
      state.loading = false
    },
    setSelectedRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.selectedRestaurant = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setRestaurants, setSelectedRestaurant, setLoading, setError } = restaurantSlice.actions
export default restaurantSlice.reducer

