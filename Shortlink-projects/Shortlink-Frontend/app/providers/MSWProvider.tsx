'use client'

import { useEffect, useState } from 'react'

/**
 * MSW Provider Component
 * 
 * Initializes Mock Service Worker in the browser for development.
 * This allows the frontend to work without a backend by using mock API responses.
 * 
 * Usage: Wrap your app with this provider in development mode only.
 */

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    // Check if MSW should be enabled
    const enableMSW = process.env.NEXT_PUBLIC_ENABLE_MSW !== 'false'
    const isDevelopment = process.env.NODE_ENV === 'development'
    const hasApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    
    // Only initialize MSW in development, in browser, when enabled, and when no explicit API URL is set
    // If NEXT_PUBLIC_API_BASE_URL is set, it means user wants to use real backend
    if (
      typeof window !== 'undefined' &&
      isDevelopment &&
      enableMSW &&
      !hasApiBaseUrl
    ) {
      // Dynamically import MSW to avoid including it in production builds
      import('../../mocks/browser')
        .then(({ worker }) => {
          // Start the MSW Service Worker
          return worker.start({
            onUnhandledRequest: 'warn',
            serviceWorker: {
              url: '/mockServiceWorker.js',
            },
          })
        })
        .then(() => {
          console.log('[MSW] ✅ Mock Service Worker started successfully')
          console.log('[MSW] 📡 All API requests will be intercepted by mock handlers')
          setMswReady(true)
        })
        .catch((error) => {
          console.warn('[MSW] ⚠️  Failed to start Mock Service Worker:', error)
          console.warn('[MSW] 💡 Make sure you have run: npm run msw:init')
          // Continue without MSW if it fails to start
          setMswReady(true)
        })
    } else {
      // Skip MSW initialization in these cases:
      // - Production environment
      // - MSW explicitly disabled
      // - Explicit API base URL is set (using real backend)
      if (hasApiBaseUrl && isDevelopment) {
        console.log(`[MSW] ℹ️  Using real backend: ${hasApiBaseUrl}`)
      }
      setMswReady(true)
    }
  }, [])

  // Wait for MSW to be ready before rendering children
  // This prevents flash of unmocked content
  if (!mswReady) {
    return null // Or a loading indicator
  }

  return <>{children}</>
}
