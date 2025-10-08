import React, { useState } from 'react'
import { Users, ChevronDown, Upload } from 'lucide-react'

function AssignmentForm({ onCreate, classData }) {
  const [assignmentTitle, setAssignmentTitle] = useState('')
  const [assignmentDescription, setAssignmentDescription] = useState('')
  const [assignmentLinks, setAssignmentLinks] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [audience, setAudience] = useState('All students')
  const [showAudience, setShowAudience] = useState(false)
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

  const handleSubmit = () => {
    console.log('AssignmentForm classData:', classData);
    console.log('Available keys:', Object.keys(classData || {}));
    
    if (!assignmentTitle.trim() || !assignmentDescription.trim()) {
      alert('Please fill title and description');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', assignmentTitle);
    formData.append('description', assignmentDescription);
    formData.append('links', assignmentLinks);
    formData.append('scheduleTime', dueDate);
    
    const crCode = classData?.classCode || classData?.CRcode || classData?.name || '';
    console.log('Trying CRcode:', crCode);
    
    if (!crCode) {
      alert(`Classroom code not found. ClassData: ${JSON.stringify(classData)}`);
      return;
    }
    formData.append('CRcode', crCode);
    
    if (selectedFile && selectedFile.data) {
      const byteCharacters = atob(selectedFile.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: selectedFile.contentType });
      formData.append('image', file, selectedFile.originalName);
    }
    
    if (onCreate) {
      onCreate(formData);
    }
    
    setAssignmentTitle('')
    setAssignmentDescription('')
    setAssignmentLinks('')
    setDueDate('')
    setSelectedFile(null)
    setContentType('assignment')
  }

  return (
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
            id="assignment-file-upload"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <label htmlFor="assignment-file-upload" className="cursor-pointer flex items-center justify-center space-x-2 text-gray-600 hover:text-[#356AC3]">
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
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!assignmentTitle.trim() || !assignmentDescription.trim()}
          >
            {contentType === 'assignment' ? 'Post Assignment' : 'Post Study Material'}
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{contentType === 'assignment' ? 'Assignment Options' : 'Study Material Options'}</h3>
        <div className="grid grid-cols-1 gap-4">
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
    </div>
  )
}

export default AssignmentForm