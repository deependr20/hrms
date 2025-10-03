'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaStar, FaChartLine, FaTrophy } from 'react-icons/fa'

export default function PerformancePage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchReviews(parsedUser.employeeId._id)
    }
  }, [])

  const fetchReviews = async (employeeId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/performance?employeeId=${employeeId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      const data = await response.json()
      if (data.success) {
        setReviews(data.data)
      }
    } catch (error) {
      console.error('Fetch reviews error:', error)
      toast.error('Failed to fetch performance reviews')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Performance</h1>
        <p className="text-gray-600 mt-1">Track your performance reviews and goals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Overall Rating</h3>
            <FaTrophy className="text-yellow-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-gray-800">
              {reviews.length > 0 ? reviews[0]?.overallRating?.toFixed(1) : '0.0'}
            </div>
            <div className="flex">
              {renderStars(reviews.length > 0 ? Math.round(reviews[0]?.overallRating || 0) : 0)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
            <FaChartLine className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{reviews.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Goals Achieved</h3>
            <FaTrophy className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {reviews.filter(r => r.goalsAchieved).length}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Performance Reviews</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No performance reviews found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {review.reviewPeriod}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Reviewed by: {review.reviewer?.firstName} {review.reviewer?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.reviewDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {review.overallRating?.toFixed(1)}
                    </span>
                    <div className="flex">
                      {renderStars(Math.round(review.overallRating || 0))}
                    </div>
                  </div>
                </div>

                {review.comments && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Comments:</h4>
                    <p className="text-sm text-gray-600">{review.comments}</p>
                  </div>
                )}

                {review.strengths && review.strengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {review.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {review.areasOfImprovement && review.areasOfImprovement.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Areas of Improvement:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {review.areasOfImprovement.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

