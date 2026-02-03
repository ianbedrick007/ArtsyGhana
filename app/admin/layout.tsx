import { requireAdmin } from '@/lib/auth-helpers'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAdmin()
  } catch {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  )
}
