'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaClock, FaCalendarAlt, FaChartLine, FaDownload, FaFilter } from 'react-icons/fa'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function AttendanceReportPage() {
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [summary, setSummary] = useState({})

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchAttendanceReport(parsedUser.employeeId._id)
    }
  }, [selectedMonth, selectedYear])

  const fetchAttendanceReport = async (employeeId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/attendance?employeeId=${employeeId}&month=${selectedMonth}&year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success) {
        setAttendanceData(data.data)
        calculateSummary(data.data)
      }
    } catch (error) {
      console.error('Fetch attendance error:', error)
      toast.error('Failed to fetch attendance report')
    } finally {
      setLoading(false)
    }
  }

  const calculateSummary = (data) => {
    const totalDays = data.length
    const presentDays = data.filter(d => d.status === 'present').length
    const absentDays = data.filter(d => d.status === 'absent').length
    const lateDays = data.filter(d => d.status === 'late').length
    const halfDays = data.filter(d => d.status === 'half-day').length
    const totalHours = data.reduce((sum, d) => sum + (d.workHours || 0), 0)
    const avgHours = totalDays > 0 ? totalHours / totalDays : 0
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

    setSummary({
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      halfDays,
      totalHours: Math.round(totalHours * 100) / 100,
      avgHours: Math.round(avgHours * 100) / 100,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100,
    })
  }

  const getChartData = () => {
    const dailyData = attendanceData.map(record => ({
      date: new Date(record.date).getDate(),
      hours: record.workHours || 0,
      status: record.status,
    }))
    return dailyData
  }

  const getStatusDistribution = () => {
    const statusCounts = {
      present: attendanceData.filter(d => d.status === 'present').length,
      absent: attendanceData.filter(d => d.status === 'absent').length,
      late: attendanceData.filter(d => d.status === 'late').length,
      'half-day': attendanceData.filter(d => d.status === 'half-day').length,
      'on-leave': attendanceData.filter(d => d.status === 'on-leave').length,
    }

    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        value: count,
        color: getStatusColor(status),
      }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981'
      case 'absent': return '#ef4444'
      case 'late': return '#f59e0b'
      case 'half-day': return '#8b5cf6'
      case 'on-leave': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMonthName = (month) => {
    return new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })
  }

  const exportReport = () => {
    // Simple CSV export
    const headers = ['Date', 'Check In', 'Check Out', 'Work Hours', 'Status']
    const csvData = attendanceData.map(record => [
      formatDate(record.date),
      formatTime(record.checkIn),
      formatTime(record.checkOut),
      record.workHours || 0,
      record.status
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-report-${selectedYear}-${selectedMonth}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Attendance Report</h1>
          <p className="text-gray-600 mt-1">Detailed analysis of your attendance patterns</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <FaDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Total Days', value: summary.totalDays, color: 'bg-blue-500', icon: FaCalendarAlt },
          { title: 'Present Days', value: summary.presentDays, color: 'bg-green-500', icon: FaClock },
          { title: 'Total Hours', value: `${summary.totalHours}h`, color: 'bg-purple-500', icon: FaChartLine },
          { title: 'Attendance %', value: `${summary.attendancePercentage}%`, color: 'bg-indigo-500', icon: FaChartLine },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Hours Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Working Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#8b5cf6" name="Hours Worked" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getStatusDistribution()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getStatusDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.presentDays}</div>
            <div className="text-sm text-gray-500">Present Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{summary.absentDays}</div>
            <div className="text-sm text-gray-500">Absent Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.lateDays}</div>
            <div className="text-sm text-gray-500">Late Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{summary.halfDays}</div>
            <div className="text-sm text-gray-500">Half Days</div>
          </div>
        </div>
      </div>

      {/* Detailed Attendance Records */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Records - {getMonthName(selectedMonth)} {selectedYear}
          </h3>
        </div>
        {attendanceData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No attendance records found for the selected period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.checkIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.workHours ? `${record.workHours}h` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'half-day' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.overtime ? `${record.overtime}h` : '0h'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
