import React from 'react'
import { FaHome, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaIdCard } from 'react-icons/fa'
import Link from 'next/link'

function Sidebar() {
  const navItems = [
    { href: '/', icon: <FaHome />, label: 'Home' },
    { href: '/dashboard/users', icon: <FaUsers />, label: 'Users' },
    { href: '/dashboard/plans', icon: <FaIdCard />, label: 'Plans' },
    { href: '#', icon: <FaChartBar />, label: 'Analytics' },
    { href: '#', icon: <FaCog />, label: 'Settings' },
  ]

  return (
    <div className="h-full w-10 md:w-20 bg-pink-800 rounded-md shadow-2xl shadow-pink-800">
      <ul className="h-full flex flex-col items-center justify-between py-4">
        <div>
          {navItems.map((item, index) => (
            <li key={index} className="group relative mt-4">
              <Link href={item.href}>
                <div className="text-white text-2xl cursor-pointer">
                  {item.icon}
                </div>
                <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </div>

        <li className="group relative mb-5">
          <Link href="/">
            <div className="text-white text-2xl cursor-pointer">
              <FaSignOutAlt />
            </div>
            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
              Logout
            </span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
