'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaUserMinus, FaCheckCircle, FaClock } from 'react-icons/fa'

export default function OffboardingPage() {
  const [offboardings, setOffboardings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffboardings()
  }, [])

  const fetchOffboardings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/offboarding', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setOffboardings(data.data)
      }
    } catch (error) {
      console.error('Fetch offboarding error:', error)
      toast.error('Failed to fetch offboarding records')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Offboarding</h1>
          <p className="text-gray-600 mt-1">Manage employee exit process</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FaUserMinus />
          <span>New Offboarding</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Exits</h3>
            <FaUserMinus className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{offboardings.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <FaClock className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {offboardings.filter(o => o.status === 'in-progress').length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <FaCheckCircle className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {offboardings.filter(o => o.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Offboarding List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Exit Records</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading offboarding records...</p>
          </div>
        ) : offboardings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No offboarding records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Working Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exit Interview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offboardings.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.employee?.firstName} {record.employee?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.employee?.employeeCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.lastWorkingDay).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.resignationReason || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.exitInterviewCompleted ? (
                        <span className="text-green-600">✓ Completed</span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                        record.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
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

