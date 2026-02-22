'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dropdown } from 'antd'
import { useAuth } from '@/src/hooks/useAuth'
import { useDomain } from '@/src/store/useStore'
import { logout as logoutApi } from '@/src/api'
import { removeKey, removeUsername, getToken, getUsername } from '@/src/lib/auth'
import { message } from 'antd'
import styles from './layout.module.css'

/**
 * Home Layout (Dashboard Layout)
 * Matches Vue: views/home/HomeIndex.vue
 * This layout wraps all /home/* routes
 */
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { logout: logoutAuth } = useAuth()
  const { domain } = useDomain()
  const [username, setUsername] = useState('')

  useEffect(() => {
    // Get username and truncate if needed
    const actualUsername = getUsername()
    if (actualUsername) {
      setUsername(truncateText(actualUsername, 8))
    }
  }, [])

  // Navigate to My Space
  const toMySpace = () => {
    router.push('/home/space')
  }

  // Navigate to Profile
  const toMine = () => {
    router.push('/home/account')
  }

  // Logout
  const handleLogout = async () => {
    try {
      const token = getToken()
      const username = getUsername()
      
      if (token && username) {
        await logoutApi({ token, username })
      }
      
      // Clear auth data
      removeUsername()
      removeKey()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
      }
      
      // Use auth hook logout for state management
      await logoutAuth()
      message.success('Logged out successfully!')
    } catch (error) {
      // Even if API fails, clear local data
      removeUsername()
      removeKey()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
      }
      await logoutAuth()
    }
  }

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  // Dropdown menu items
  const menuItems = [
    {
      key: 'profile',
      label: 'Profile',
      onClick: toMine,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  return (
    <div className={styles.layoutContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div onClick={toMySpace} className={styles.logo}>
            Shortlink SaaS Platform
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <div className={styles.block}>
                <span className={styles.nameSpan}>
                  {username}
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.contentBox}>
        <div className={styles.contentSpace}>{children}</div>
      </main>
    </div>
  )
}
