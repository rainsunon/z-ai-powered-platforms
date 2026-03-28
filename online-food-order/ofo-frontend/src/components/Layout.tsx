import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

