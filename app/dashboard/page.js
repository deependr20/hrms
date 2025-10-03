'use client'

import { useEffect, useState } from 'react'
import { 
  FaUsers, FaClock, FaCalendarAlt, FaMoneyBillWave, 
  FaChartLine, FaBriefcase, FaArrowUp, FaArrowDown 
} from 'react-icons/fa'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const statsData = [
  { title: 'Total Employees', value: '1,234', change: '+12%', icon: FaUsers, color: 'bg-blue-500', trend: 'up' },
  { title: 'Present Today', value: '1,156', change: '93.7%', icon: FaClock, color: 'bg-green-500', trend: 'up' },
  { title: 'On Leave', value: '45', change: '-5%', icon: FaCalendarAlt, color: 'bg-yellow-500', trend: 'down' },
  { title: 'Pending Approvals', value: '23', change: '+3', icon: FaChartLine, color: 'bg-purple-500', trend: 'up' },
  { title: 'Open Positions', value: '18', change: '+6', icon: FaBriefcase, color: 'bg-red-500', trend: 'up' },
  { title: 'Payroll (This Month)', value: '$2.5M', change: '+8%', icon: FaMoneyBillWave, color: 'bg-indigo-500', trend: 'up' },
]

const attendanceData = [
  { name: 'Mon', present: 1150, absent: 84 },
  { name: 'Tue', present: 1180, absent: 54 },
  { name: 'Wed', present: 1160, absent: 74 },
  { name: 'Thu', present: 1190, absent: 44 },
  { name: 'Fri', present: 1156, absent: 78 },
]

const departmentData = [
  { name: 'Engineering', value: 450, color: '#0088FE' },
  { name: 'Sales', value: 280, color: '#00C49F' },
  { name: 'Marketing', value: 180, color: '#FFBB28' },
  { name: 'HR', value: 120, color: '#FF8042' },
  { name: 'Finance', value: 204, color: '#8884D8' },
]

const leaveData = [
  { month: 'Jan', leaves: 45 },
  { month: 'Feb', leaves: 52 },
  { month: 'Mar', leaves: 48 },
  { month: 'Apr', leaves: 61 },
  { month: 'May', leaves: 55 },
  { month: 'Jun', leaves: 67 },
]

export default function DashboardPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋</h1>
        <p className="text-primary-100">Here's what's happening with your organization today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
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
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leave Trend Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leaveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="leaves" stroke="#8b5cf6" strokeWidth={2} name="Total Leaves" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'New employee onboarded', name: 'Sarah Johnson', time: '2 hours ago', color: 'bg-green-100 text-green-800' },
              { action: 'Leave approved', name: 'Mike Chen', time: '4 hours ago', color: 'bg-blue-100 text-blue-800' },
              { action: 'Payroll processed', name: 'December 2024', time: '1 day ago', color: 'bg-purple-100 text-purple-800' },
              { action: 'Performance review completed', name: 'Team Alpha', time: '2 days ago', color: 'bg-yellow-100 text-yellow-800' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[0]}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.name}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Mark Attendance', icon: FaClock, href: '/dashboard/attendance', color: 'bg-green-500' },
              { name: 'Apply Leave', icon: FaCalendarAlt, href: '/dashboard/leave/apply', color: 'bg-blue-500' },
              { name: 'View Payslip', icon: FaMoneyBillWave, href: '/dashboard/payroll/payslips', color: 'bg-purple-500' },
              { name: 'Submit Expense', icon: FaChartLine, href: '/dashboard/expenses', color: 'bg-red-500' },
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
    </div>
  )
}

