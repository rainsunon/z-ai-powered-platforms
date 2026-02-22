import { redirect } from 'next/navigation'

/**
 * Root page - redirects to /home
 * Matches Vue router: path: '/', redirect: '/home'
 */
export default function Home() {
  redirect('/home')
}
