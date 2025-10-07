import React, { useState } from 'react'
import { Bold, Italic, Underline, Link, Calendar, Users, ChevronDown, Paperclip } from 'lucide-react'

function PostForm({ onCreate, classData }) {
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [externalLinks, setExternalLinks] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [audience, setAudience] = useState('All students')
  const [showAudience, setShowAudience] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handlePost = () => {
    if (!postTitle.trim() || !postContent.trim()) {
      alert('Please add both title and content');
      return;
    }
    
    console.log('Creating post with classData:', classData);
    console.log('Available keys:', Object.keys(classData || {}));
    
    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('description', postContent);
    formData.append('content', postContent);
    formData.append('youtubeLink', youtubeLink);
    formData.append('links', externalLinks);
    formData.append('scheduleTime', scheduleTime);
    
    const crCode = classData?.classCode || classData?.CRcode || classData?.name || '';
    console.log('ClassData:', classData);
    console.log('Using CRcode:', crCode);
    
    if (!crCode || crCode === 'undefined' || crCode === '') {
      alert(`Classroom code not found. ClassData: ${JSON.stringify(classData)}`);
      return;
    }
    
    formData.append('CRcode', crCode);
    formData.append('image', selectedFile);
    
    if (onCreate) {
      onCreate(formData);
    }
    
    // Reset form
    setPostTitle('')
    setPostContent('')
    setYoutubeLink('')
    setExternalLinks('')
    setScheduleTime('')
    setSelectedFile(null)
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* Post Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
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

        {/* Content Area */}
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
            
            {/* Formatting Toolbar */}
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Shivam Kumar</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="text-xs"
            />
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button 
              onClick={handlePost}
              className="px-6 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!postTitle.trim() || !postContent.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Additional Options */}
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
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm
