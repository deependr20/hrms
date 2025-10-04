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

const employeeStatsData = [
  { title: 'Hours This Month', value: '168', change: '+8h', icon: FaClock, color: 'bg-blue-500', trend: 'up' },
  { title: 'Leave Balance', value: '12 days', change: '-3', icon: FaCalendarAlt, color: 'bg-green-500', trend: 'down' },
  { title: 'This Month Salary', value: '$4,500', change: '+$200', icon: FaMoneyBillWave, color: 'bg-purple-500', trend: 'up' },
  { title: 'Pending Tasks', value: '5', change: '-2', icon: FaFileAlt, color: 'bg-yellow-500', trend: 'down' },
  { title: 'Completed Courses', value: '3', change: '+1', icon: FaGraduationCap, color: 'bg-indigo-500', trend: 'up' },
  { title: 'Performance Score', value: '92%', change: '+5%', icon: FaAward, color: 'bg-teal-500', trend: 'up' },
]

const attendanceData = [
  { date: 'Dec 9', hours: 8.5 },
  { date: 'Dec 10', hours: 8.0 },
  { date: 'Dec 11', hours: 8.5 },
  { date: 'Dec 12', hours: 9.0 },
  { date: 'Dec 13', hours: 8.0 },
  { date: 'Dec 16', hours: 8.5 },
  { date: 'Dec 17', hours: 8.0 },
]

const leaveData = [
  { month: 'Jul', used: 2, available: 10 },
  { month: 'Aug', used: 1, available: 9 },
  { month: 'Sep', used: 3, available: 6 },
  { month: 'Oct', used: 0, available: 6 },
  { month: 'Nov', used: 2, available: 4 },
  { month: 'Dec', used: 1, available: 3 },
]

export default function EmployeeDashboard({ user }) {
  const [announcements, setAnnouncements] = useState([])
  const [holidays, setHolidays] = useState([])
  const [loading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')

      // Fetch announcements and holidays in parallel
      const [announcementsRes, holidaysRes] = await Promise.all([
        fetch('/api/announcements?limit=5', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/holidays?limit=5', { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      const [announcementsData, holidaysData] = await Promise.all([
        announcementsRes.json(),
        holidaysRes.json()
      ])

      if (announcementsData.success) {
        setAnnouncements(announcementsData.data)
      }

      if (holidaysData.success) {
        setHolidays(holidaysData.data)
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error)
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">My Dashboard 🌟</h1>
        <p className="text-teal-100">Track your work, growth, and achievements</p>
      </div>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FaBullhorn className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-800">Latest Announcements</h2>
            </div>
            <a href="/dashboard/announcements" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => {
              const PriorityIcon = getPriorityIcon(announcement.priority)
              return (
                <div key={announcement._id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(announcement.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <PriorityIcon className="w-5 h-5 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>By {announcement.createdBy?.firstName} {announcement.createdBy?.lastName}</span>
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FaGift className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Holidays</h2>
            </div>
            <a href="/dashboard/holidays" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidays.slice(0, 3).map((holiday) => (
              <div key={holiday._id} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{holiday.name}</h3>
                    <p className="text-sm text-gray-600">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeStatsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <FaArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Working Hours (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} hours`, 'Working Hours']} />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} name="Hours Worked" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="used" fill="#ef4444" name="Used" />
              <Bar dataKey="available" fill="#10b981" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personal Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'Clocked in', details: 'Started work at 9:00 AM', time: '2 hours ago', color: 'bg-green-100 text-green-800' },
              { action: 'Task completed', details: 'Finished user authentication module', time: '4 hours ago', color: 'bg-blue-100 text-blue-800' },
              { action: 'Leave applied', details: 'Annual leave for Dec 20-24', time: '1 day ago', color: 'bg-purple-100 text-purple-800' },
              { action: 'Training completed', details: 'React Advanced Concepts', time: '2 days ago', color: 'bg-yellow-100 text-yellow-800' },
              { action: 'Performance review', details: 'Q4 review submitted', time: '3 days ago', color: 'bg-indigo-100 text-indigo-800' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[0]}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.details}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Mark Attendance', icon: FaClock, href: '/dashboard/attendance', color: 'bg-green-500' },
              { name: 'Apply Leave', icon: FaCalendarAlt, href: '/dashboard/leave/apply', color: 'bg-blue-500' },
              { name: 'View Payslip', icon: FaMoneyBillWave, href: '/dashboard/payroll/payslips', color: 'bg-purple-500' },
              { name: 'My Profile', icon: FaUser, href: '/dashboard/profile', color: 'bg-red-500' },
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className={`${action.color} p-3 rounded-lg mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Information & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Schedule</h3>
          <div className="space-y-3">
            {[
              { time: '9:00 AM', task: 'Daily standup meeting', status: 'completed' },
              { time: '10:30 AM', task: 'Code review session', status: 'completed' },
              { time: '2:00 PM', task: 'Client presentation', status: 'upcoming' },
              { time: '4:00 PM', task: 'Team retrospective', status: 'upcoming' },
              { time: '5:30 PM', task: 'Documentation update', status: 'pending' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.task}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
          <div className="space-y-4">
            {[
              { course: 'React Advanced Concepts', progress: 100, status: 'Completed' },
              { course: 'Node.js Best Practices', progress: 75, status: 'In Progress' },
              { course: 'Database Optimization', progress: 45, status: 'In Progress' },
              { course: 'DevOps Fundamentals', progress: 0, status: 'Not Started' },
            ].map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{course.course}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    course.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      course.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
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
