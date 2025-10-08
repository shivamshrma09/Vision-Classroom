import React, { useState } from 'react'
import { Bold, Italic, Underline, Link, Calendar, Users, ChevronDown, Paperclip, MessageCircle, ThumbsUp, Share, FileText, Send, Upload, Image } from 'lucide-react'

function AssignmentDisplay({ assignment, onViewSubmissions, showSubmissions, setShowSubmissions, submissions, onSubmit, isTeacher, classData, onCommentAdded }) {

  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState(assignment.comments || [])
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [submissionFile, setSubmissionFile] = useState(null)
  const [submissionText, setSubmissionText] = useState('')
  const addComment = async () => {
    if (!newComment.trim()) return
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.name) {
        alert('User not found. Please login again.')
        return
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/assignment-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentId: assignment._id,
          comment: newComment,
          CRcode: classData?.CRcode,
          userInfo: user.name
        })
      })
      
      const result = await response.json()
      if (response.ok) {
        const newCommentObj = {
          id: Date.now(),
          author: user.name,
          text: newComment,
          createdAt: new Date().toISOString()
        }
        setComments(prev => [newCommentObj, ...prev])
        setNewComment('')
        if (onCommentAdded) onCommentAdded(newCommentObj)
      } else {
        alert(result.message || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Network error. Please try again.')
    }
  }

  



  if (!assignment) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
              <span className="text-white font-medium text-sm">TE</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{assignment.title || assignment.name}</h3>
              <p className="text-sm text-gray-500">{assignment.date} Assignment</p>
            </div>
          </div>
          {isTeacher && (
            <button 
              onClick={async () => {
                try {
                  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/assignment-submissions/${assignment._id}?CRcode=${classData?.CRcode}`)
                  const result = await response.json()
                  
                  if (response.ok) {
                    if (onViewSubmissions) {
                      onViewSubmissions(assignment._id, result.submissions)
                    }
                  } else {
                    alert(result.msg || 'Failed to load submissions')
                  }
                } catch (error) {
                  console.error('Error loading submissions:', error)
                  alert('Failed to load submissions')
                }
              }}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              View Submissions
            </button>
          )}
          {assignment.contentType === 'assignment' && isTeacher && (
  <button 
    onClick={async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/assignment-submissions/${assignment._id}?CRcode=${classData?.CRcode}`)
        const result = await response.json()
        
        if (response.ok) {
          if (onViewSubmissions) {
            onViewSubmissions(assignment._id, result.submissions)
          }
        } else {
          alert(result.msg || 'Failed to load submissions')
        }
      } catch (error) {
        console.error('Error loading submissions:', error)
        alert('Failed to load submissions')
      }
    }}
    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
  >
    View Submissions
  </button>
)}

        </div>
      </div>

      <div className="p-3">
        {assignment.title && (
          <h3 className="text-base font-semibold text-gray-900 mb-2">{assignment.title}</h3>
        )}
        <p className="text-gray-800 leading-relaxed mb-3 text-sm">{assignment.description}</p>
        
        {assignment.scheduleTime && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Due Date:</span>
              <span className="text-sm text-blue-700">
                {new Date(assignment.scheduleTime).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}
        
        {assignment.file && assignment.file.contentType && assignment.file.contentType.startsWith('image/') && (
          <div className="mt-3 mb-3">
            <img 
              src={`data:${assignment.file.contentType};base64,${assignment.file.data}`}
              alt={assignment.file.originalName}
              className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">{assignment.file.originalName}</p>
          </div>
        )}

        {assignment.file && !assignment.file.contentType.startsWith('image/') && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Assignment File</span>
            </div>
            <div className="flex items-center p-3 space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{assignment.file.originalName}</p>
                <p className="text-xs text-gray-500">{assignment.file.contentType}</p>
              </div>
              <button className="px-3 py-1 bg-[#356AC3] text-white text-xs rounded hover:bg-[#356AC3]/90">
                Download
              </button>
            </div>
          </div>
        )}
        
        {assignment.links && (
          <div className="mt-3 border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-700">Reference Link</span>
            </div>
            <div className="flex items-center p-3 space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <Link className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <a href={assignment.links} target="_blank" rel="noopener noreferrer" className="text-[#356AC3] hover:underline text-xs">
                  {assignment.links.length > 40 ? assignment.links.substring(0, 40) + '...' : assignment.links}
                </a>
              </div>
            </div>
          </div>
        )}
        

      </div>

      <div className="px-3 py-2 border-t border-gray-100">
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
          {!isTeacher && (
            <button 
              onClick={() => setShowSubmissionModal(true)}
              className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors text-sm"
            >
              Submit Assignment
            </button>
          )}
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {(() => {
                    const user = JSON.parse(localStorage.getItem('user') || '{}')
                    const name = user.name || 'User'
                    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  })()}
                </span>
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

          <div className="p-4 space-y-3">
            {comments.map(comment => {
              const getInitials = (name) => {
                return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
              }
              
              return (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">{getInitials(comment.author)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Assignment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setSubmissionFile({
                          data: event.target.result.split(',')[1],
                          contentType: file.type,
                          originalName: file.name
                        })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                />
                {submissionFile && (
                  <p className="text-xs text-gray-500 mt-1">{submissionFile.originalName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Add any notes or comments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!submissionFile && !submissionText.trim()) return
                  
                  try {
                    const user = JSON.parse(localStorage.getItem('user') || '{}')
                    if (!user._id) {
                      alert('Please login again')
                      return
                    }
                    
                    const formData = new FormData()
                    formData.append('assignmentId', assignment._id)
                    formData.append('studentId', user._id)
                    formData.append('studentName', user.name)
                    formData.append('text', submissionText)
                    formData.append('CRcode', classData?.CRcode)
                    
                    if (submissionFile) {
                      const byteCharacters = atob(submissionFile.data)
                      const byteNumbers = new Array(byteCharacters.length)
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i)
                      }
                      const byteArray = new Uint8Array(byteNumbers)
                      const blob = new Blob([byteArray], { type: submissionFile.contentType })
                      formData.append('file', blob, submissionFile.originalName)
                    }
                    
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/submit-assignment`, {
                      method: 'POST',
                      body: formData
                    })
                    
                    const result = await response.json()
                    
                    if (response.ok) {
                      setShowSubmissionModal(false)
                      setSubmissionFile(null)
                      setSubmissionText('')
                      alert('Assignment submitted successfully!')
                    } else {
                      alert(result.msg || 'Failed to submit assignment')
                    }
                  } catch (error) {
                    console.error('Error submitting assignment:', error)
                    alert('Network error. Please try again.')
                  }
                }}
                className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors"
                disabled={!submissionFile && !submissionText.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assignment Submissions</h3>
              <button
                onClick={() => setShowSubmissions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {submissions && submissions.length > 0 ? (
                submissions.map((submission, index) => (
                  <div key={submission._id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{submission.studentName}</p>
                      <p className="text-sm text-gray-500">Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
                      {submission.file && (
                        <p className="text-xs text-gray-400">{submission.file.originalName}</p>
                      )}
                      {submission.text && (
                        <p className="text-xs text-gray-600 mt-1">Note: {submission.text}</p>
                      )}
                    </div>
                    {submission.file && (
                      <button 
                        onClick={() => {
                          const byteCharacters = atob(submission.file.data)
                          const byteNumbers = new Array(byteCharacters.length)
                          for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i)
                          }
                          const byteArray = new Uint8Array(byteNumbers)
                          const blob = new Blob([byteArray], { type: submission.file.contentType })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = submission.file.originalName
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                        }}
                        className="px-3 py-1 bg-[#356AC3] text-white text-sm rounded hover:bg-[#356AC3]/90"
                      >
                        Download
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No submissions yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Assignment({ assignments = [] }) {
  const [assignmentTitle, setAssignmentTitle] = useState('')
  const [assignmentDescription, setAssignmentDescription] = useState('')
  const [assignmentLinks, setAssignmentLinks] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [classroomCode, setClassroomCode] = useState('')
  const [audience, setAudience] = useState('All students')
  const [showAudience, setShowAudience] = useState(false)
  const [createdAssignments, setCreatedAssignments] = useState(assignments)
  const [selectedFile, setSelectedFile] = useState(null)
  const [contentType, setContentType] = useState('assignment')

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedFile({
          data: e.target.result.split(',')[1], 
          contentType: file.type,
          originalName: file.name
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAssignment = () => {
    if (!assignmentTitle.trim() || !assignmentDescription.trim()) return
    
    const newAssignment = {
      id: Date.now(),
      title: assignmentTitle,
      description: assignmentDescription,
      file: selectedFile,
      links: assignmentLinks || null,
      scheduleTime: dueDate || null,
      CRcode: classroomCode || null,
      audience,
      contentType,
      createdAt: new Date().toISOString()
    }
    
    setCreatedAssignments([newAssignment, ...createdAssignments])
    
    // Reset form
    setAssignmentTitle('')
    setAssignmentDescription('')
    setAssignmentLinks('')
    setDueDate('')
    setClassroomCode('')
    setSelectedFile(null)
    setContentType('assignment')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
                <span className="text-white font-medium text-sm">SK</span>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowAudience(!showAudience)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <span>For</span>
                  <Users className="w-4 h-4" />
                  <span>{audience}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showAudience && (
                  <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                    <button 
                      onClick={() => {setAudience('All students'); setShowAudience(false)}}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      All students
                    </button>
                    <button 
                      onClick={() => {setAudience('Specific students'); setShowAudience(false)}}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Specific students
                    </button>
                  </div>
                )}
              </div>
            </div>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent text-gray-600 bg-gray-50"
            >
              <option value="assignment">Assignment</option>
              <option value="study_material">Study Material</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder={contentType === 'assignment' ? 'Assignment title' : 'Study material title'}
            className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
          />
          <textarea
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
            placeholder={contentType === 'assignment' ? 'Assignment instructions and description' : 'Study material description'}
            className="w-full min-h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
          />
          
          <div className="mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#356AC3] transition-colors">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center space-x-2 text-gray-600 hover:text-[#356AC3]">
              <Upload className="w-5 h-5" />
              <span className="text-sm">
                {selectedFile ? selectedFile.originalName : contentType === 'assignment' ? 'Upload assignment file or image' : 'Upload study material file or image'}
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Shivam Kumar</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleAssignment}
              className="px-6 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!assignmentTitle.trim() || !assignmentDescription.trim()}
            >
              {contentType === 'assignment' ? 'Post Assignment' : 'Post Study Material'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{contentType === 'assignment' ? 'Assignment Options' : 'Study Material Options'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Reference Links</label>
            <input 
              type="url"
              value={assignmentLinks}
              onChange={(e) => setAssignmentLinks(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
            <input 
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
            />
          </div>

        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Posts</h2>
        {createdAssignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No posts yet. Create your first post above!</p>
          </div>
        ) : (
          createdAssignments.map(assignment => (
            <AssignmentDisplay 
              key={assignment.id} 
              assignment={assignment}
              isTeacher={true}
              classData={{ CRcode: classroomCode }}
              onSubmit={(submission) => console.log('Assignment submitted:', submission)}
              onViewSubmissions={(id) => console.log('View submissions for:', id)}
              showSubmissions={false}
              setShowSubmissions={() => {}}
              submissions={[]}
              onCommentAdded={(comment) => console.log('Comment added:', comment)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export { AssignmentDisplay };
export default Assignment;
