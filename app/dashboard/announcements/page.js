'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaPlus, FaBullhorn, FaCalendarAlt } from 'react-icons/fa'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/announcements', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setAnnouncements(data.data)
      }
    } catch (error) {
      console.error('Fetch announcements error:', error)
      toast.error('Failed to fetch announcements')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-600 mt-1">Company-wide announcements and updates</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No announcements found
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaBullhorn className="text-primary-500 text-xl" />
                    <h3 className="text-xl font-bold text-gray-800">
                      {announcement.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                    {announcement.content}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt />
                      <span>
                        {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {announcement.createdBy && (
                      <span>
                        By {announcement.createdBy.firstName} {announcement.createdBy.lastName}
                      </span>
                    )}
                    {announcement.department && (
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {announcement.department}
                      </span>
                    )}
                  </div>
                </div>

                {announcement.isActive && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Active
                  </span>
                )}
              </div>

              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {announcement.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        className="text-sm text-primary-600 hover:text-primary-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

