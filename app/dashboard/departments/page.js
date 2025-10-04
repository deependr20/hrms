'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash, FaBuilding, FaUsers } from 'react-icons/fa'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [user, setUser] = useState(null)
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    head: '',
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Check role-based access
      if (!['admin', 'hr'].includes(parsedUser.role)) {
        // For employees and managers, show read-only view
        fetchDepartments()
      } else {
        // For admin and HR, show full management interface
        fetchDepartments()
        fetchEmployees()
      }
    }
  }, [])

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/departments', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setDepartments(data.data)
      } else {
        toast.error(data.message || 'Failed to fetch departments')
      }
    } catch (error) {
      console.error('Fetch departments error:', error)
      toast.error('Failed to fetch departments')
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setEmployees(data.data)
      }
    } catch (error) {
      console.error('Fetch employees error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      const url = editingDept
        ? `/api/departments/${editingDept._id}`
        : '/api/departments'
      const method = editingDept ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        setShowModal(false)
        setEditingDept(null)
        setFormData({ name: '', description: '', code: '' })
        fetchDepartments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to save department')
    }
  }

  const handleEdit = (dept) => {
    setEditingDept(dept)
    setFormData({
      name: dept.name,
      description: dept.description || '',
      code: dept.code || '',
      head: dept.head?._id || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        fetchDepartments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete department')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingDept(null)
    setFormData({ name: '', description: '', code: '', head: '' })
  }

  const canManageDepartments = () => {
    return user && ['admin', 'hr'].includes(user.role)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-600 mt-1">
            {canManageDepartments() ? 'Manage company departments' : 'View company departments'}
          </p>
        </div>
        {canManageDepartments() && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Departments</h3>
            <FaBuilding className="text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{departments.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Active Departments</h3>
            <FaBuilding className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {departments.filter(d => d.isActive !== false).length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Employees</h3>
            <FaUsers className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No departments found
          </div>
        ) : (
          departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <FaBuilding className="text-primary-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{dept.name}</h3>
                    {dept.code && (
                      <p className="text-sm text-gray-500">{dept.code}</p>
                    )}
                  </div>
                </div>
                {canManageDepartments() && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit Department"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Department"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              {dept.description && (
                <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaUsers />
                  <span>{dept.employeeCount || 0} Employees</span>
                </div>
                {dept.head && (
                  <div className="text-sm text-gray-600">
                    Head: {dept.head.firstName} {dept.head.lastName}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingDept ? 'Edit Department' : 'Add Department'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., ENG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Department description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Head
                  </label>
                  <select
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Department Head</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName} ({employee.employeeCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

