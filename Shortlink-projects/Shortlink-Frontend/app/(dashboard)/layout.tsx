'use client'

/**
 * Dashboard Layout
 * Matches Vue: views/home/HomeIndex.vue
 * This layout wraps all dashboard pages (/space, /recycle-bin, /account)
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      {/* Header/Sidebar will be added here */}
      <main>{children}</main>
    </div>
  )
}
