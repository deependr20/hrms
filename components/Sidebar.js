'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FaChevronDown, FaChevronRight
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { getMenuItemsForRole } from '@/utils/roleBasedMenus'

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState({})
  const [menuItems, setMenuItems] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Get menu items based on user role
      const roleBasedMenu = getMenuItemsForRole(parsedUser.role)
      setMenuItems(roleBasedMenu)
    }
  }, [])

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-3 sm:p-6">
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold">HR</span>
            </div>
            <span className="text-lg sm:text-xl font-bold">HRMS</span>
          </div>

        </div>

        <nav className="px-2 sm:px-4 pb-6">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 mb-1"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">{item.name}</span>
                    </div>
                    {expandedMenus[item.name] ? (
                      <FaChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </button>
                  {expandedMenus[item.name] && (
                    <div className="ml-6 sm:ml-8 space-y-1 mb-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`block px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors duration-200 ${
                            pathname === subItem.path
                              ? 'bg-primary-500 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-200 mb-1 ${
                    pathname === item.path
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

