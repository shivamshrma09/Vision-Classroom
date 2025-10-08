import React, { useState } from 'react'
import { Bold, Italic, Underline, Link, Calendar, Users, ChevronDown, Paperclip, MessageCircle, ThumbsUp, Share, FileText, Send } from 'lucide-react'

function PostDisplay({ post, classData, onCommentAdded }) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState(post.comments || [])

  const addComment = async () => {
    if (!newComment.trim()) return
    
    try {
      const user = JSON.parse(localStorage.getItem('user') )
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: post._id,
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

  if (!post) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {post.author?.charAt(0)?.toUpperCase() || 'T'}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {post.author || classData?.adminName || 'Teacher'}
            </h3>
            <p className="text-sm text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : 'Today'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {post.title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h3>
        )}
        {post.content && (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>
        )}
        
        {post.scheduleTime && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Scheduled for:</span>
              <span className="text-sm text-blue-700">
                {new Date(post.scheduleTime).toLocaleString('en-US', {
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
        
        {post.file && post.file.data && (
          <div className="mt-3">
            {post.file.contentType && post.file.contentType.startsWith('image/') ? (
              <div>
                <img 
                  src={`data:${post.file.contentType};base64,${post.file.data}`}
                  alt={post.file.originalName || 'Post image'}
                  className="max-w-full h-auto rounded-lg border border-gray-200"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
                {post.file.originalName && (
                  <p className="text-xs text-gray-500 mt-1">{post.file.originalName}</p>
                )}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {post.file.originalName || 'Document'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.file.contentType === 'application/pdf' ? 'PDF Document' : 'Document'}
                    </p>
                  </div>
                  <a 
                    href={`data:${post.file.contentType};base64,${post.file.data}`}
                    download={post.file.originalName}
                    className="px-3 py-1 bg-[#356AC3] text-white text-xs rounded hover:bg-[#356AC3]/90"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        
        {(post.youtubeLink || post.links) && (
          <div className="mt-3 flex gap-3">
            {post.youtubeLink && (
              <div className="flex-1 border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-700">YouTube video</span>
                  <span className="text-xs text-gray-500 ml-2">0 minutes</span>
                </div>
                <div className="p-3">
                  <a href={post.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-[#356AC3] hover:underline text-xs">
                    {post.youtubeLink.length > 30 ? post.youtubeLink.substring(0, 30) + '...' : post.youtubeLink}
                  </a>
                </div>
              </div>
            )}
            
            {post.links && (
              <div className="flex-1 border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-700">Untitled document</span>
                </div>
                <div className="flex items-center p-3 space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">Google Docs</p>
                    <a href={post.links} target="_blank" rel="noopener noreferrer" className="text-[#356AC3] hover:underline text-xs">
                      {post.links.length > 25 ? post.links.substring(0, 25) + '...' : post.links}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
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
      </div>

      {showComments && (
        <div className="border-t border-gray-100">
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

          <div className="p-4 space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="flex space-x-3">
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
    </div>
  )
}

function Post({ onCreate }) {
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [externalLinks, setExternalLinks] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [audience, setAudience] = useState('All students')
  const [showAudience, setShowAudience] = useState(false)

  const handlePost = () => {
    if (!postContent.trim()) return
    
    const newPost = {
      id: Date.now(),
      title: postTitle,
      content: postContent,
      youtubeLink: youtubeLink || null,
      links: externalLinks || null,
      scheduleTime: scheduleTime || null,
      audience,
      createdAt: new Date().toISOString()
    }
    
    if (onCreate) {
      onCreate(newPost)
    }
    
    setPostTitle('')
    setPostContent('')
    setYoutubeLink('')
    setExternalLinks('')
    setScheduleTime('')
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
              <span className="text-white font-medium text-sm">SK</span>
            </div>
            <div className="flex-1">
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
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Post title (optional)"
            className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
          />
          <div className="relative">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Announce something to your class"
              className="w-full min-h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
            />
            
            <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Bold className="w-3 h-3 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Italic className="w-3 h-3 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Underline className="w-3 h-3 text-gray-600" />
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Link className="w-3 h-3 text-gray-600" />
              </button>
            </div>
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
              onClick={handlePost}
              className="px-6 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!postContent.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-xs font-medium text-gray-700 mb-2">Additional Options</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">YouTube Link</label>
            <input 
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">External Links</label>
            <input 
              type="url"
              value={externalLinks}
              onChange={(e) => setExternalLinks(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Schedule Time</label>
            <input 
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
export { PostDisplay }