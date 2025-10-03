'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaTachometerAlt, FaUsers, FaClock, FaCalendarAlt, FaMoneyBillWave, 
  FaChartLine, FaBriefcase, FaUserPlus, FaSignOutAlt, FaFileAlt,
  FaBox, FaReceipt, FaPlane, FaHeadset, FaBook, FaGraduationCap,
  FaBullhorn, FaCog, FaChevronDown, FaChevronRight
} from 'react-icons/fa'
import { useState } from 'react'

const menuItems = [
  { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
  { 
    name: 'Employees', 
    icon: FaUsers, 
    path: '/dashboard/employees',
    submenu: [
      { name: 'All Employees', path: '/dashboard/employees' },
      { name: 'Add Employee', path: '/dashboard/employees/add' },
      { name: 'Departments', path: '/dashboard/departments' },
      { name: 'Designations', path: '/dashboard/designations' },
    ]
  },
  { 
    name: 'Attendance', 
    icon: FaClock, 
    path: '/dashboard/attendance',
    submenu: [
      { name: 'Mark Attendance', path: '/dashboard/attendance' },
      { name: 'Attendance Report', path: '/dashboard/attendance/report' },
      { name: 'Shifts', path: '/dashboard/attendance/shifts' },
    ]
  },
  { 
    name: 'Leave', 
    icon: FaCalendarAlt, 
    path: '/dashboard/leave',
    submenu: [
      { name: 'Apply Leave', path: '/dashboard/leave/apply' },
      { name: 'Leave Requests', path: '/dashboard/leave/requests' },
      { name: 'Leave Balance', path: '/dashboard/leave/balance' },
      { name: 'Leave Types', path: '/dashboard/leave/types' },
    ]
  },
  { 
    name: 'Payroll', 
    icon: FaMoneyBillWave, 
    path: '/dashboard/payroll',
    submenu: [
      { name: 'Process Payroll', path: '/dashboard/payroll' },
      { name: 'Payslips', path: '/dashboard/payroll/payslips' },
      { name: 'Salary Structure', path: '/dashboard/payroll/structure' },
    ]
  },
  { 
    name: 'Performance', 
    icon: FaChartLine, 
    path: '/dashboard/performance',
    submenu: [
      { name: 'Reviews', path: '/dashboard/performance/reviews' },
      { name: 'Goals (OKR)', path: '/dashboard/performance/goals' },
      { name: 'Feedback', path: '/dashboard/performance/feedback' },
    ]
  },
  { 
    name: 'Recruitment', 
    icon: FaBriefcase, 
    path: '/dashboard/recruitment',
    submenu: [
      { name: 'Job Openings', path: '/dashboard/recruitment/jobs' },
      { name: 'Candidates', path: '/dashboard/recruitment/candidates' },
      { name: 'Interviews', path: '/dashboard/recruitment/interviews' },
    ]
  },
  { 
    name: 'Onboarding', 
    icon: FaUserPlus, 
    path: '/dashboard/onboarding'
  },
  { 
    name: 'Offboarding', 
    icon: FaSignOutAlt, 
    path: '/dashboard/offboarding'
  },
  { 
    name: 'Documents', 
    icon: FaFileAlt, 
    path: '/dashboard/documents'
  },
  { 
    name: 'Assets', 
    icon: FaBox, 
    path: '/dashboard/assets'
  },
  { 
    name: 'Expenses', 
    icon: FaReceipt, 
    path: '/dashboard/expenses'
  },
  { 
    name: 'Travel', 
    icon: FaPlane, 
    path: '/dashboard/travel'
  },
  { 
    name: 'Helpdesk', 
    icon: FaHeadset, 
    path: '/dashboard/helpdesk'
  },
  { 
    name: 'Policies', 
    icon: FaBook, 
    path: '/dashboard/policies'
  },
  { 
    name: 'Learning (LMS)', 
    icon: FaGraduationCap, 
    path: '/dashboard/learning',
    submenu: [
      { name: 'Courses', path: '/dashboard/learning/courses' },
      { name: 'My Trainings', path: '/dashboard/learning/trainings' },
      { name: 'Certificates', path: '/dashboard/learning/certificates' },
    ]
  },
  { 
    name: 'Announcements', 
    icon: FaBullhorn, 
    path: '/dashboard/announcements'
  },
  { 
    name: 'Settings', 
    icon: FaCog, 
    path: '/dashboard/settings',
    submenu: [
      { name: 'Company Settings', path: '/dashboard/settings/company' },
      { name: 'Holidays', path: '/dashboard/settings/holidays' },
      { name: 'Locations', path: '/dashboard/settings/locations' },
    ]
  },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState({})

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
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">HR</span>
            </div>
            <span className="text-xl font-bold">HRMS</span>
          </div>
        </div>

        <nav className="px-4 pb-6">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 mb-1"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {expandedMenus[item.name] ? (
                      <FaChevronDown className="w-4 h-4" />
                    ) : (
                      <FaChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedMenus[item.name] && (
                    <div className="ml-8 space-y-1 mb-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
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
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 mb-1 ${
                    pathname === item.path
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

