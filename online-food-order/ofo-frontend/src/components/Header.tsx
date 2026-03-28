import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { ShoppingCart, User, LogOut } from 'lucide-react'

interface HeaderProps {
  isAuthenticated: boolean
}

const Header = ({ isAuthenticated }: HeaderProps) => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            🍔 OFO
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/restaurants" className="text-gray-700 hover:text-primary transition">
              Restaurants
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
                  <ShoppingCart size={24} />
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-primary transition">
                  Orders
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary transition">
                  <User size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-destructive transition"
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

