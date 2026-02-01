import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import type { UserRole } from '../../types'

interface DashboardLayoutProps {
  role: UserRole
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
