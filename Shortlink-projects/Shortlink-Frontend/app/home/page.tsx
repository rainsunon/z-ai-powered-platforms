import { redirect } from 'next/navigation'

/**
 * /home route - redirects to /home/space
 * Matches Vue router: path: '/home', redirect: '/home/space'
 */
export default function HomePage() {
  redirect('/home/space')
}
