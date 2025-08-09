import React from 'react'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-2 bg-white h-screen w-full p-2">
      <Sidebar />
      <div className="flex-1 rounded-md shadow-inner bg-gray-800 p-4 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
