'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaCog, FaSearch } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function Header({ toggleSidebar }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <FaBars className="w-6 h-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search employees, documents..."
              className="bg-transparent border-none focus:outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">New leave request from John Doe</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">Payroll processed for December</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">New announcement posted</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 text-center">
                  <a href="/dashboard/notifications" className="text-sm text-primary-600 hover:text-primary-700">
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Employee'}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <a
                  href="/dashboard/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUser className="w-4 h-4" />
                  <span>My Profile</span>
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaCog className="w-4 h-4" />
                  <span>Settings</span>
                </a>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

