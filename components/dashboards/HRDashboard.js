'use client'

import { 
  FaUsers, FaClock, FaCalendarAlt, FaUserPlus, 
  FaArrowUp, FaArrowDown, FaBriefcase, FaFileAlt,
  FaExclamationCircle, FaCheckCircle
} from 'react-icons/fa'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const hrStatsData = [
  { title: 'Total Employees', value: '1,234', change: '+12%', icon: FaUsers, color: 'bg-blue-500', trend: 'up' },
  { title: 'New Hires (This Month)', value: '24', change: '+8', icon: FaUserPlus, color: 'bg-green-500', trend: 'up' },
  { title: 'Leave Requests', value: '45', change: '+5', icon: FaCalendarAlt, color: 'bg-yellow-500', trend: 'up' },
  { title: 'Open Positions', value: '18', change: '+6', icon: FaBriefcase, color: 'bg-red-500', trend: 'up' },
  { title: 'Pending Approvals', value: '12', change: '-3', icon: FaExclamationCircle, color: 'bg-orange-500', trend: 'down' },
  { title: 'Completed Reviews', value: '89', change: '+15', icon: FaCheckCircle, color: 'bg-purple-500', trend: 'up' },
]

const hiringData = [
  { month: 'Jan', hires: 18, departures: 5 },
  { month: 'Feb', hires: 22, departures: 8 },
  { month: 'Mar', hires: 25, departures: 6 },
  { month: 'Apr', hires: 20, departures: 12 },
  { month: 'May', hires: 28, departures: 7 },
  { month: 'Jun', hires: 24, departures: 9 },
]

const leaveData = [
  { name: 'Sick Leave', value: 45, color: '#ef4444' },
  { name: 'Annual Leave', value: 120, color: '#10b981' },
  { name: 'Personal Leave', value: 35, color: '#f59e0b' },
  { name: 'Maternity/Paternity', value: 15, color: '#8b5cf6' },
]

export default function HRDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">HR Dashboard 👥</h1>
        <p className="text-green-100">Manage people, processes, and organizational growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hrStatsData.map((stat, index) => (
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
        {/* Hiring Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring vs Departures Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hiringData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={3} name="New Hires" />
              <Line type="monotone" dataKey="departures" stroke="#ef4444" strokeWidth={3} name="Departures" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {leaveData.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HR Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent HR Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent HR Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'New employee onboarded', name: 'Sarah Johnson - Engineering', time: '2 hours ago', color: 'bg-green-100 text-green-800' },
              { action: 'Leave request approved', name: 'Mike Chen - 3 days annual leave', time: '4 hours ago', color: 'bg-blue-100 text-blue-800' },
              { action: 'Performance review scheduled', name: 'Team Alpha - Q4 Reviews', time: '6 hours ago', color: 'bg-purple-100 text-purple-800' },
              { action: 'Job posting published', name: 'Senior Developer - Remote', time: '1 day ago', color: 'bg-yellow-100 text-yellow-800' },
              { action: 'Policy updated', name: 'Remote Work Guidelines', time: '2 days ago', color: 'bg-indigo-100 text-indigo-800' },
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

        {/* HR Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Add Employee', icon: FaUserPlus, href: '/dashboard/employees/add', color: 'bg-green-500' },
              { name: 'Review Leaves', icon: FaCalendarAlt, href: '/dashboard/leave/approvals', color: 'bg-blue-500' },
              { name: 'Post Job', icon: FaBriefcase, href: '/dashboard/recruitment/jobs', color: 'bg-purple-500' },
              { name: 'Generate Report', icon: FaFileAlt, href: '/dashboard/reports', color: 'bg-red-500' },
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

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'John Doe', type: 'Annual Leave', dates: 'Dec 20-24, 2024', status: 'Pending' },
                { name: 'Jane Smith', type: 'Sick Leave', dates: 'Dec 15, 2024', status: 'Pending' },
                { name: 'Mike Johnson', type: 'Personal Leave', dates: 'Dec 22-23, 2024', status: 'Pending' },
              ].map((request, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.dates}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                    <button className="text-red-600 hover:text-red-900">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
