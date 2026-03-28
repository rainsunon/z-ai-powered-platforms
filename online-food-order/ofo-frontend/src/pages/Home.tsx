import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl">
        <h1 className="text-5xl font-bold mb-6">
          Delicious Food, Delivered Fast
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Order from your favorite restaurants and enjoy fresh meals delivered right to your door.
        </p>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary/90 transition"
        >
          Browse Restaurants
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Get your food delivered in 30 minutes or less</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">Choose from hundreds of restaurants</p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">💳</div>
          <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
          <p className="text-gray-600">Safe and encrypted payment processing</p>
        </div>
      </section>
    </div>
  )
}

export default Home

