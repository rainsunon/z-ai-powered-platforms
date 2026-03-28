import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice'
import { Minus, Plus, Trash2 } from 'lucide-react'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, restaurantName, total } = useSelector((state: RootState) => state.cart)

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId))
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }))
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Browse Restaurants
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-destructive hover:text-destructive/80 transition flex items-center gap-2"
        >
          <Trash2 size={20} />
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">From: {restaurantName}</h3>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.itemId} className="flex items-center justify-between py-4 border-b last:border-b-0">
              <div className="flex-1">
                <h4 className="font-semibold">{item.itemName}</h4>
                <p className="text-gray-600 text-sm">${item.price} each</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                    className="p-2 hover:bg-gray-200 rounded-l-lg transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                    className="p-2 hover:bg-gray-200 rounded-r-lg transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-lg font-bold w-24 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.itemId))}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Delivery Fee</span>
            <span>$3.99</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Tax</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold pt-4 border-t">
            <span>Total</span>
            <span>${(total * 1.1 + 3.99).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary/90 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart

