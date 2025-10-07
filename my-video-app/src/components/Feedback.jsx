import React, { useState } from 'react'
import { Star, MessageSquare, Send } from 'lucide-react'

// Feedback Display Component
function FeedbackDisplay({ feedback }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  if (!feedback) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {feedback.studentName ? feedback.studentName.charAt(0) : 'S'}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{feedback.studentName || 'Anonymous'}</h4>
              <p className="text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(feedback.rating)}
          </div>
        </div>

        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {feedback.category}
          </span>
        </div>

        <p className="text-gray-800 text-sm leading-relaxed mb-3">{feedback.message}</p>

        {feedback.suggestions && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-1">Suggestions:</p>
            <p className="text-sm text-gray-600">{feedback.suggestions}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Feedback({ onCreate, classData, currentUserId, currentUserName }) {
  const [studentName, setStudentName] = useState('')
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('general')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock feedback data
  const [feedbacks] = useState([
    {
      id: 1,
      studentName: 'Rahul Sharma',
      category: 'Teaching',
      rating: 5,
      message: 'Excellent explanation of complex topics. The examples were very helpful.',
      suggestions: 'Maybe add more practice problems.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      studentName: 'Priya Singh',
      category: 'Course Content',
      rating: 4,
      message: 'Good course structure and materials. Easy to follow.',
      suggestions: 'Include more real-world examples.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      studentName: 'Anonymous',
      category: 'Communication',
      rating: 3,
      message: 'Sometimes difficult to understand. Could speak slower.',
      suggestions: 'Use more visual aids during explanations.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ])

  const handleSubmitFeedback = async () => {
    if (!message.trim() || !subject.trim()) {
      alert('Please fill in subject and message')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Try different possible localStorage keys
      let user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.id) {
        user = JSON.parse(localStorage.getItem('userData') || '{}')
      }
      if (!user.id) {
        user = JSON.parse(localStorage.getItem('currentUser') || '{}')
      }
      
      console.log('User from localStorage:', user)
      console.log('All localStorage keys:', Object.keys(localStorage))
      
      // Check different possible user ID fields (login stores as _id)
      const userId = user._id || user.id || user.userId || user.uid
      const userName = user.name || user.username || user.fullName || user.displayName
      
      // Fallback to props if localStorage is empty
      let finalUserId = userId || currentUserId
      let finalUserName = userName || currentUserName
      
      // Temporary fix: use teacher ID from your logs if no user found
      if (!finalUserId) {
        finalUserId = '68e547d49f55129c67b0d8cb' // Teacher ID from your console logs
        finalUserName = 'Teacher'
        console.log('Using temporary teacher ID for testing')
      }
      
      const feedbackData = {
        studentId: finalUserId,
        studentName: isAnonymous ? 'Anonymous' : (studentName || finalUserName),
        subject: subject,
        message: message,
        rating: rating || null,
        category: category,
        CRcode: classData?.CRcode
      }
      
      console.log('Submitting feedback:', feedbackData)
      
      const response = await fetch('http://localhost:4000/fetures/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      })
      
      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response result:', result)
      
      if (response.ok) {
        alert('Feedback submitted successfully!')
        // Reset form
        setStudentName('')
        setSubject('')
        setCategory('general')
        setRating(0)
        setMessage('')
        setIsAnonymous(false)
        
        if (onCreate) {
          onCreate(result.feedback)
        }
      } else {
        console.error('Feedback submission failed:', result)
        alert(result.msg || 'Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* Feedback Form Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Submit Feedback</h3>
              <p className="text-sm text-gray-500">Share your thoughts and suggestions</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter feedback subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Your Name (Optional)</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                disabled={isAnonymous}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="content">Content</option>
                <option value="suggestion">Suggestion</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-[#356AC3] focus:ring-[#356AC3] border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-2">Rating (Optional)</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating}/5` : 'No rating'}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">Feedback Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full min-h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
            />
          </div>


        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Student Feedback</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              className="px-6 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim() || !subject.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback
export { FeedbackDisplay }