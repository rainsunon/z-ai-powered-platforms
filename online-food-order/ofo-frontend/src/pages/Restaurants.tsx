import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { setRestaurants, setLoading, setError } from '../store/slices/restaurantSlice'
import { restaurantApi } from '../api'

const Restaurants = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { restaurants, loading, error } = useSelector((state: RootState) => state.restaurant)

  useEffect(() => {
    const fetchRestaurants = async () => {
      dispatch(setLoading(true))
      try {
        const response = await restaurantApi.getAll()
        dispatch(setRestaurants(response.data))
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to fetch restaurants'))
      }
    }

    fetchRestaurants()
  }, [dispatch])

  if (loading) return <div className="text-center py-12">Loading restaurants...</div>
  if (error) return <div className="text-center py-12 text-destructive">Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Restaurants</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center text-4xl">
              🍴
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{restaurant.description || 'Delicious food awaits'}</p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-500">⭐ {restaurant.rating || '4.5'}</span>
                <span className="text-sm text-gray-500">{restaurant.address || 'Nearby'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Restaurants

