'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  FaClock, FaCalendarAlt, FaMoneyBillWave, FaFileAlt,
  FaArrowUp, FaArrowDown, FaGraduationCap, FaAward,
  FaCheckCircle, FaExclamationCircle, FaUser, FaBullhorn,
  FaExclamationTriangle, FaGift
} from 'react-icons/fa'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function EmployeeDashboard({ user }) {
  const [announcements, setAnnouncements] = useState([])
  const [holidays, setHolidays] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Fetch all dashboard data in parallel
      const [announcementsRes, holidaysRes, statsRes] = await Promise.all([
        fetch('/api/announcements?limit=5', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/holidays?limit=5', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/dashboard/employee-stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      const [announcementsData, holidaysData, statsData] = await Promise.all([
        announcementsRes.json(),
        holidaysRes.json(),
        statsRes.json()
      ])

      if (announcementsData.success) {
        setAnnouncements(announcementsData.data)
      }

      if (holidaysData.success) {
        setHolidays(holidaysData.data)
      }

      if (statsData.success) {
        setDashboardStats(statsData.data)
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return FaExclamationTriangle
      case 'medium': return FaBullhorn
      case 'low': return FaCheckCircle
      default: return FaBullhorn
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  // Create dynamic stats data
  const employeeStatsData = dashboardStats ? [
    {
      title: 'Hours This Month',
      value: `${dashboardStats.stats.hoursThisMonth.value}h`,
      change: `${dashboardStats.stats.hoursThisMonth.change >= 0 ? '+' : ''}${dashboardStats.stats.hoursThisMonth.change}h`,
      icon: FaClock,
      color: 'bg-blue-500',
      trend: dashboardStats.stats.hoursThisMonth.trend
    },
    {
      title: 'Leave Balance',
      value: `${dashboardStats.stats.leaveBalance.value} days`,
      change: `${dashboardStats.stats.leaveBalance.change >= 0 ? '+' : ''}${dashboardStats.stats.leaveBalance.change}`,
      icon: FaCalendarAlt,
      color: 'bg-green-500',
      trend: dashboardStats.stats.leaveBalance.trend
    },
    {
      title: 'This Month Salary',
      value: `₹${dashboardStats.stats.thisMonthSalary.value.toLocaleString()}`,
      change: `${dashboardStats.stats.thisMonthSalary.change >= 0 ? '+' : ''}₹${Math.abs(dashboardStats.stats.thisMonthSalary.change).toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: 'bg-purple-500',
      trend: dashboardStats.stats.thisMonthSalary.trend
    },
    {
      title: 'Pending Tasks',
      value: `${dashboardStats.stats.pendingTasks.value}`,
      change: `${dashboardStats.stats.pendingTasks.change >= 0 ? '+' : ''}${dashboardStats.stats.pendingTasks.change}`,
      icon: FaFileAlt,
      color: 'bg-yellow-500',
      trend: dashboardStats.stats.pendingTasks.trend
    },
    {
      title: 'Completed Courses',
      value: `${dashboardStats.stats.completedCourses.value}`,
      change: `${dashboardStats.stats.completedCourses.change >= 0 ? '+' : ''}${dashboardStats.stats.completedCourses.change}`,
      icon: FaGraduationCap,
      color: 'bg-indigo-500',
      trend: dashboardStats.stats.completedCourses.trend
    },
    {
      title: 'Performance Score',
      value: `${dashboardStats.stats.performanceScore.value}%`,
      change: `${dashboardStats.stats.performanceScore.change >= 0 ? '+' : ''}${dashboardStats.stats.performanceScore.change}%`,
      icon: FaAward,
      color: 'bg-teal-500',
      trend: dashboardStats.stats.performanceScore.trend
    },
  ] : []

  return (
    <div className="page-container space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-3 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Dashboard 🌟</h1>
        <p className="text-teal-100 text-sm sm:text-base">Track your work, growth, and achievements</p>
        {dashboardStats?.employee && (
          <div className="mt-3 text-teal-100 text-sm">
            <p>Welcome back, {dashboardStats.employee.name}!</p>
          </div>
        )}
      </div>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <FaBullhorn className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Latest Announcements</h2>
            </div>
            <a href="/dashboard/announcements" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => {
              const PriorityIcon = getPriorityIcon(announcement.priority)
              return (
                <div key={announcement._id} className={`p-3 sm:p-4 rounded-lg border-l-4 ${getPriorityColor(announcement.priority)}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-start space-x-3 flex-1">
                      <PriorityIcon className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{announcement.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-xs text-gray-500 space-y-1 sm:space-y-0">
                          <span>By {announcement.createdBy?.firstName} {announcement.createdBy?.lastName}</span>
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-auto ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming Holidays */}
      {holidays.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <FaGift className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Upcoming Holidays</h2>
            </div>
            <a href="/dashboard/holidays" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {holidays.slice(0, 3).map((holiday) => (
              <div key={holiday._id} className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{holiday.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {new Date(holiday.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {employeeStatsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-3 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">{stat.title}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</h3>
                <div className="flex items-center mt-1 sm:mt-2">
                  {stat.trend === 'up' ? (
                    <FaArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                  ) : stat.trend === 'down' ? (
                    <FaArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 flex-shrink-0" />
                  ) : null}
                  <span className={`text-xs sm:text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-500' :
                    stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-1 hidden sm:inline">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 sm:p-4 rounded-lg flex-shrink-0 ml-3`}>
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Daily Hours */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Daily Working Hours (Last 7 Days)</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardStats?.attendanceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value} hours`, 'Working Hours']}
                  labelStyle={{ fontSize: '12px' }}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Hours Worked"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Leave Balance Trend</h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats?.leaveData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  labelStyle={{ fontSize: '12px' }}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="used" fill="#ef4444" name="Used" />
                <Bar dataKey="available" fill="#10b981" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Personal Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">My Recent Activities</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { action: 'Clocked in', details: 'Started work at 9:00 AM', time: '2 hours ago', color: 'bg-green-100 text-green-800' },
              { action: 'Task completed', details: 'Finished user authentication module', time: '4 hours ago', color: 'bg-blue-100 text-blue-800' },
              { action: 'Leave applied', details: 'Annual leave for Dec 20-24', time: '1 day ago', color: 'bg-purple-100 text-purple-800' },
              { action: 'Training completed', details: 'React Advanced Concepts', time: '2 days ago', color: 'bg-yellow-100 text-yellow-800' },
              { action: 'Performance review', details: 'Q4 review submitted', time: '3 days ago', color: 'bg-indigo-100 text-indigo-800' },
            ].map((activity, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activity.color.split(' ')[0]}`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 self-start sm:self-auto ml-5 sm:ml-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {[
              { name: 'Mark Attendance', icon: FaClock, href: '/dashboard/attendance', color: 'bg-green-500' },
              { name: 'Apply Leave', icon: FaCalendarAlt, href: '/dashboard/leave/apply', color: 'bg-blue-500' },
              { name: 'View Payslip', icon: FaMoneyBillWave, href: '/dashboard/payroll/payslips', color: 'bg-purple-500' },
              { name: 'My Profile', icon: FaUser, href: '/dashboard/profile', color: 'bg-red-500' },
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex flex-col items-center justify-center p-3 sm:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className={`${action.color} p-2 sm:p-3 rounded-lg mb-2 sm:mb-3`}>
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center leading-tight">{action.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Information & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Today&apos;s Schedule</h3>
          <div className="space-y-3">
            {[
              { time: '9:00 AM', task: 'Daily standup meeting', status: 'completed' },
              { time: '10:30 AM', task: 'Code review session', status: 'completed' },
              { time: '2:00 PM', task: 'Client presentation', status: 'upcoming' },
              { time: '4:00 PM', task: 'Team retrospective', status: 'upcoming' },
              { time: '5:30 PM', task: 'Documentation update', status: 'pending' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 last:border-0 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{item.task}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-auto ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
          <div className="space-y-4">
            {[
              { course: 'React Advanced Concepts', progress: 100, status: 'Completed' },
              { course: 'Node.js Best Practices', progress: 75, status: 'In Progress' },
              { course: 'Database Optimization', progress: 45, status: 'In Progress' },
              { course: 'DevOps Fundamentals', progress: 0, status: 'Not Started' },
            ].map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate pr-2">{course.course}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-auto ${
                    course.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    course.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      course.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{course.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
