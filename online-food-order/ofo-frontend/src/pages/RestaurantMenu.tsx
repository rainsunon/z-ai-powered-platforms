import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setSelectedRestaurant, setLoading } from '../store/slices/restaurantSlice'
import { addToCart } from '../store/slices/cartSlice'
import { restaurantApi } from '../api'
import { Plus } from 'lucide-react'

const RestaurantMenu = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const { selectedRestaurant, loading } = useSelector((state: RootState) => state.restaurant)

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return
      dispatch(setLoading(true))
      try {
        const response = await restaurantApi.getById(id)
        dispatch(setSelectedRestaurant(response.data))
      } catch (err) {
        console.error('Failed to fetch restaurant', err)
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchRestaurant()
  }, [id, dispatch])

  const handleAddToCart = (item: any) => {
    if (selectedRestaurant) {
      dispatch(addToCart({
        item: { ...item, quantity: 1 },
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
      }))
    }
  }

  if (loading) return <div className="text-center py-12">Loading menu...</div>
  if (!selectedRestaurant) return <div className="text-center py-12">Restaurant not found</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{selectedRestaurant.name}</h1>
        <p className="text-gray-600">{selectedRestaurant.description}</p>
        <div className="mt-2 text-yellow-500">⭐ {selectedRestaurant.rating || '4.5'}</div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedRestaurant.menuList?.map((item: any) => (
          <div key={item.itemId} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{item.itemName}</h3>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">${item.price}</span>
              <button
                onClick={() => handleAddToCart(item)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center gap-2"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RestaurantMenu

