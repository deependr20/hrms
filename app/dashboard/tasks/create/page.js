'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaTasks, FaSave, FaArrowLeft } from 'react-icons/fa'
import RoleBasedAccess from '@/components/RoleBasedAccess'

export default function CreateTaskPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    dueDate: '',
    estimatedHours: '',
    assignToSelf: true,
    assignToOthers: false,
    selectedEmployees: []
  })
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeUser = async () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          console.log('User loaded:', parsedUser)
          setUser(parsedUser)
          await fetchEmployees()
          setIsInitializing(false)
        } catch (error) {
          console.error('Error parsing user data:', error)
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    initializeUser()
  }, []) // Empty dependency array - run only once on mount

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/employees?status=active&limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Employees API response:', data)
        setEmployees(data.data.employees || [])
        console.log('Employees set:', data.data.employees?.length || 0)
      } else {
        console.error('Failed to fetch employees:', response.status)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEmployeeSelection = (employeeId) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(employeeId)
        ? prev.selectedEmployees.filter(id => id !== employeeId)
        : [...prev.selectedEmployees, employeeId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!formData.title || !formData.dueDate) {
      setError('Title and due date are required')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Build assignees array
      let assignees = []

      if (formData.assignToSelf) {
        console.log('Adding self to assignees. User ID:', user.userId)
        assignees.push({
          employee: user.userId,
          role: 'owner'
        })
      }

      if (formData.assignToOthers && formData.selectedEmployees.length > 0) {
        console.log('Adding selected employees:', formData.selectedEmployees)
        formData.selectedEmployees.forEach(employeeId => {
          if (!assignees.find(a => a.employee === employeeId)) {
            assignees.push({
              employee: employeeId,
              role: 'owner'
            })
          }
        })
      }

      console.log('Final assignees array:', assignees)

      if (assignees.length === 0) {
        setError('Please assign the task to at least one person')
        return
      }

      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : 0,
        assignedBy: user.userId,
        assignedTo: assignees
      }

      const response = await fetch(`/api/tasks?_t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(taskData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Task created successfully!')
        setTimeout(() => {
          router.push('/dashboard/tasks/my-tasks')
        }, 1500)
      } else {
        setError(data.message || 'Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      setError('An error occurred while creating the task')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredEmployees = () => {
    if (!user) return []

    return employees.filter(emp => {
      if (emp._id === user.userId) return false // Don't show self in others list

      // Show based on role permissions
      if (user.role === 'admin' || user.role === 'hr') {
        return true // Can assign to anyone
      } else if (user.role === 'manager') {
        // Managers CANNOT assign to HR or Admin
        if (emp.role === 'hr' || emp.role === 'admin') {
          return false
        }

        // Check if this employee reports to this manager
        const isDirectReport = emp.reportingManager?._id === user.userId ||
                              emp.reportingManager === user.userId

        // Check if same department (for peer assignment)
        const sameDept = emp.department?._id === user.department ||
                        emp.department === user.department

        return isDirectReport || sameDept
      } else {
        // Regular employees can only assign to same department colleagues
        // NOT to HR or Admin
        if (emp.role === 'hr' || emp.role === 'admin') {
          return false
        }

        return emp.department?._id === user.department ||
               emp.department === user.department
      }
    })
  }

  if (isInitializing || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    )
  }

  return (
    <RoleBasedAccess allowedRoles={['admin', 'hr', 'manager', 'employee']}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <FaTasks className="mr-3 text-blue-600" />
                  Create New Task
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">Create and assign a new task</p>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Task Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="project">Project</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="research">Research</option>
                  <option value="meeting">Meeting</option>
                  <option value="training">Training</option>
                  <option value="review">Review</option>
                  <option value="documentation">Documentation</option>
                  <option value="development">Development</option>
                  <option value="testing">Testing</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Assignment Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Assignment</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="assignToSelf"
                    checked={formData.assignToSelf}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Assign to myself
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="assignToOthers"
                    checked={formData.assignToOthers}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Assign to others
                  </label>
                </div>

                {formData.assignToOthers && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-gray-700">Select employees:</p>
                      <p className="text-xs text-gray-500 italic">
                        {user?.role === 'manager' && '(Direct reports & same department)'}
                        {user?.role === 'employee' && '(Same department colleagues)'}
                        {(user?.role === 'admin' || user?.role === 'hr') && '(All employees)'}
                      </p>
                    </div>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {getFilteredEmployees().map(employee => (
                        <div key={employee._id} className="flex items-center py-1">
                          <input
                            type="checkbox"
                            checked={formData.selectedEmployees.includes(employee._id)}
                            onChange={() => handleEmployeeSelection(employee._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            {employee.firstName} {employee.lastName}
                            {employee.department?.name && ` (${employee.department.name})`}
                            {employee.designation?.name && ` - ${employee.designation.name}`}
                          </label>
                        </div>
                      ))}
                      {getFilteredEmployees().length === 0 && (
                        <p className="text-sm text-gray-500">
                          No employees available for assignment.
                          {user?.role === 'manager' && ' You can only assign to your direct reports or same department colleagues.'}
                          {user?.role === 'employee' && ' You can only assign to colleagues in your department.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4 mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RoleBasedAccess>
  )
}
