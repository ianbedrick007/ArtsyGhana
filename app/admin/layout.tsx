'use client'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.includes('/admin/login') || pathname?.includes('/admin/signup')

  // Don't show sidebar on auth pages
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-dark-white">
      <AdminSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
