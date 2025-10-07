import React, { useState } from 'react'
import { MessageCircle, ThumbsUp, Share, Send } from 'lucide-react'

function TestDisplay({ test, onStartTest, classData, onCommentAdded }) {
  const [showStartModal, setShowStartModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState(test.comments || [])
  const [showResults, setShowResults] = useState(false)
  const [testResults, setTestResults] = useState([])
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isTeacher = currentUser.id === classData?.adminId

  const handleStartTest = () => {
    setShowStartModal(true)
  }

  const startTest = () => {
    setShowStartModal(false)
    if (onStartTest) {
      onStartTest(test)
    }
  }

  const isTestStartable = () => {
    if (isTeacher) return true // Teachers can always start tests
    
    const now = new Date()
    
    // Check if test has started (schedule time)
    if (test.scheduleTime) {
      const scheduleTime = new Date(test.scheduleTime)
      if (now < scheduleTime) return false
    }
    
    return true
  }
  
  const isTestScheduled = () => {
    return test.scheduleTime && new Date() < new Date(test.scheduleTime)
  }
  
  const viewResults = async () => {
    try {
      const response = await fetch(`http://localhost:4000/fetures/test-results/${classData?.CRcode}/${test._id}`)
      const data = await response.json()
      
      if (response.ok) {
        setTestResults(data.results || [])
        setShowResults(true)
      } else {
        alert('Failed to load results')
      }
    } catch (error) {
      console.error('Error loading results:', error)
      alert('Failed to load results')
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await fetch('http://localhost:4000/fetures/test-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: test._id,
          comment: newComment,
          CRcode: classData?.CRcode,
          userInfo: JSON.stringify(user.name)
        })
      })
      
      const result = await response.json()
      if (response.ok) {
        setNewComment('')
        if (onCommentAdded) {
          onCommentAdded()
        }
      } else {
        alert('Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment')
    }
  }

  if (!test) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      {/* Test Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
            <span className="text-white font-medium text-sm">SK</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Shivam Kumar</h3>
            <p className="text-sm text-gray-500">Oct 3 • Test</p>
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{test.description}</p>
        
        <div className="text-sm text-gray-500 space-y-1">
          <div><span>{test.questions ? test.questions.length : 0} questions</span></div>
          {test.scheduleTime && (
            <div>Schedule: {new Date(test.scheduleTime).toLocaleString()}</div>
          )}
          {test.expireTime && (
            <div>Expires: {new Date(test.expireTime).toLocaleString()}</div>
          )}
        </div>
      </div>

      {/* Test Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-[#356AC3] transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">Like</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#356AC3] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Comment</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-[#356AC3] transition-colors">
              <Share className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
          <div className="flex space-x-2">
            {isTeacher && (
              <button 
                onClick={viewResults}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                View Results
              </button>
            )}
            {isTestStartable() && (
              <button 
                onClick={handleStartTest}
                className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors text-sm"
              >
                Start Test
              </button>
            )}
            {!isTeacher && !isTestStartable() && isTestScheduled() && (
              <span className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm cursor-not-allowed">
                Test Not Started Yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          {/* Add Comment */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">CU</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addComment()}
                />
              </div>
              <button
                onClick={addComment}
                className="px-3 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="p-4 space-y-3">
            {comments.map(comment => (
              <div key={comment._id || comment.id} className="flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">CU</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total Students: {testResults.length}</p>
            </div>
            
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{result.studnetname}</p>
                      {result.studentemail && (
                        <p className="text-sm text-gray-600">{result.studentemail}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Score: {result.numberofcorrect}/{test.questions?.length || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Student #{index + 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {Math.round((result.numberofcorrect / (test.questions?.length || 1)) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {testResults.length === 0 && (
                <p className="text-center text-gray-500 py-4">No results yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Start Test Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Test</h3>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Test:</strong> {test.title}
              </p>
              {test.timeLimit && (
                <p className="text-sm text-gray-600">
                  <strong>Duration:</strong> {test.timeLimit} minutes
                </p>
              )}
              <p className="text-sm text-orange-600 font-medium">
                Once you start, the timer will begin. Make sure you're ready!
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStartModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startTest}
                className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors"
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestDisplay