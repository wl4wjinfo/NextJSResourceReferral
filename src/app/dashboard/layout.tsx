import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Geographical search and refer community resources to community members in need.',
  description: 'View and manage your resources',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
