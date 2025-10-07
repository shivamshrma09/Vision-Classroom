import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, Link, Calendar, Users, ChevronDown, Paperclip, 
  MessageCircle, ThumbsUp, Share, FileText, Send, Upload, Image 
} from 'lucide-react';

function PostDisplay({ assignments }) {
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showSubmissionModal, setShowSubmissionModal] = useState({});
  const [submissionFile, setSubmissionFile] = useState({});
  const [submissionText, setSubmissionText] = useState({});
  const [showSubmissions, setShowSubmissions] = useState({});

  // Mock submission data (could be props or dynamic in real scenario)
  const submissions = [
    { id: 1, studentName: 'Rahul Sharma', submittedAt: '2024-10-15 10:30 AM', fileName: 'assignment_rahul.pdf' },
    { id: 2, studentName: 'Priya Singh', submittedAt: '2024-10-15 11:45 AM', fileName: 'assignment_priya.docx' },
    { id: 3, studentName: 'Amit Kumar', submittedAt: '2024-10-15 02:15 PM', fileName: 'assignment_amit.pdf' }
  ];

  const handleSubmitAssignment = (id) => {
    setShowSubmissionModal(prev => ({ ...prev, [id]: true }));
  };

  const handleFileSubmission = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSubmissionFile(prev => ({
          ...prev,
          [id]: {
            data: e.target.result.split(',')[1],
            contentType: file.type,
            originalName: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitAssignment = (assignmentId) => {
    const submission = {
      assignmentId,
      file: submissionFile[assignmentId],
      text: submissionText[assignmentId],
      submittedAt: new Date().toISOString()
    };
    alert('Assignment submitted successfully!');
    // Reset states related to this assignment
    setSubmissionFile(prev => ({ ...prev, [assignmentId]: null }));
    setSubmissionText(prev => ({ ...prev, [assignmentId]: '' }));
    setShowSubmissionModal(prev => ({ ...prev, [assignmentId]: false }));
  };

  const addComment = (id) => {
    if (!newComment[id]?.trim()) return;
    const comment = {
      id: Date.now(),
      text: newComment[id],
      author: 'Current User',
      createdAt: new Date().toISOString()
    };
    setComments(prev => ({
      ...prev,
      [id]: prev[id] ? [...prev[id], comment] : [comment]
    }));
    setNewComment(prev => ({ ...prev, [id]: '' }));
  };

  const toggleComments = (id) => {
    setShowComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubmissions = (id) => {
    setShowSubmissions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!assignments || assignments.length === 0) return <p>No posts to display</p>;

  return (
    <div>
      {assignments.map(assignment => (
        <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
                  <span className="text-white font-medium text-sm">SK</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Shivam Kumar</h3>
                  <p className="text-sm text-gray-500">Oct 3 • {assignment.contentType === 'assignment' ? 'Assignment' : 'Study Material'}</p>
                </div>
              </div>
              {assignment.contentType === 'assignment' && (
                <button 
                  onClick={() => toggleSubmissions(assignment.id)}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  View Submissions
                </button>
              )}
            </div>
          </div>

          {/* Assignment Content */}
          <div className="p-4">
            {assignment.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{assignment.title}</h3>}
            <p className="text-gray-800 leading-relaxed mb-4">{assignment.description}</p>
            
            {/* Uploaded Image - Large Display */}
            {assignment.file && assignment.file.contentType && assignment.file.contentType.startsWith('image/') && (
              <div className="mt-4 mb-4">
                <img 
                  src={`data:${assignment.file.contentType};base64,${assignment.file.data}`}
                  alt={assignment.file.originalName}
                  className="w-full max-h-96 object-cover rounded-lg border border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-2">{assignment.file.originalName}</p>
              </div>
            )}

            {/* File Attachment (Non-Image) */}
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

            {/* Links */}
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

          {/* Assignment Actions */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-[#356AC3] transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Like</span>
                </button>
                <button 
                  onClick={() => toggleComments(assignment.id)}
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
              {assignment.contentType === 'assignment' && (
                <button 
                  onClick={() => handleSubmitAssignment(assignment.id)}
                  className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors text-sm"
                >
                  Submit Assignment
                </button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          {showComments[assignment.id] && (
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
                      value={newComment[assignment.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [assignment.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addComment(assignment.id)}
                    />
                  </div>
                  <button
                    onClick={() => addComment(assignment.id)}
                    className="px-3 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="p-4 space-y-3">
                {(comments[assignment.id] || []).map(comment => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">CU</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Modal */}
          {showSubmissionModal[assignment.id] && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Assignment</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileSubmission(assignment.id, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                      accept=".pdf,.doc,.docx,.txt,image/*"
                    />
                    {submissionFile[assignment.id] && (
                      <p className="text-xs text-gray-500 mt-1">{submissionFile[assignment.id].originalName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={submissionText[assignment.id] || ''}
                      onChange={(e) => setSubmissionText(prev => ({ ...prev, [assignment.id]: e.target.value }))}
                      placeholder="Add any notes or comments..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowSubmissionModal(prev => ({ ...prev, [assignment.id]: false }))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitAssignment(assignment.id)}
                    className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors"
                    disabled={!submissionFile[assignment.id] && !(submissionText[assignment.id]?.trim())}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submissions List Modal */}
          {showSubmissions[assignment.id] && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Assignment Submissions</h3>
                  <button
                    onClick={() => setShowSubmissions(prev => ({ ...prev, [assignment.id]: false }))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-3">
                  {submissions.map(submission => (
                    <div key={submission.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{submission.studentName}</p>
                        <p className="text-sm text-gray-500">Submitted: {submission.submittedAt}</p>
                        <p className="text-xs text-gray-400">{submission.fileName}</p>
                      </div>
                      <button className="px-3 py-1 bg-[#356AC3] text-white text-sm rounded hover:bg-[#356AC3]/90">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostDisplay;
