import React, { useState } from 'react'
import { Video, Calendar, Clock, Users, Play, Download } from 'lucide-react'

// Meeting Display Component
function MeetingDisplay({ meeting }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'past': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing': return '🔴 Ongoing'
      case 'upcoming': return '⏰ Upcoming'
      case 'past': return '✅ Past'
      default: return status
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm">{meeting.title}</h4>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(meeting.status)}`}>
            {getStatusText(meeting.status)}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(meeting.scheduledTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(meeting.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{meeting.participants || 0} participants</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {meeting.status === 'ongoing' && (
            <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
              Join Meeting
            </button>
          )}
          {meeting.status === 'upcoming' && (
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
              Set Reminder
            </button>
          )}
          {meeting.status === 'past' && meeting.recordingUrl && (
            <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors">
              View Recording
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Recording Display Component
function RecordingDisplay({ recording }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3">
      <div className="p-3">
        <div className="flex items-start space-x-3">
          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
            <Play className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm mb-1">{recording.title}</h4>
            <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
              <span>{new Date(recording.date).toLocaleDateString()}</span>
              <span>{recording.duration}</span>
              <span>{recording.views} views</span>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                <Play className="w-3 h-3" />
                <span>Play</span>
              </button>
              <button className="flex items-center space-x-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors">
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Class({ onCreate }) {
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDescription, setMeetingDescription] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [duration, setDuration] = useState('60')
  const [isRecording, setIsRecording] = useState(true)
  
  // Mock data
  const [meetings] = useState([
    {
      id: 1,
      title: 'Math Class - Algebra',
      scheduledTime: new Date().toISOString(),
      status: 'ongoing',
      participants: 25,
      recordingUrl: 'https://example.com/recording1'
    },
    {
      id: 2,
      title: 'Physics Lab Session',
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      participants: 0
    },
    {
      id: 3,
      title: 'Chemistry Discussion',
      scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'past',
      participants: 18,
      recordingUrl: 'https://example.com/recording3'
    }
  ])

  const [recordings] = useState([
    {
      id: 1,
      title: 'Introduction to Calculus',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: '45:30',
      views: 156,
      url: 'https://example.com/recording1'
    },
    {
      id: 2,
      title: 'Organic Chemistry Basics',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      duration: '52:15',
      views: 89,
      url: 'https://example.com/recording2'
    },
    {
      id: 3,
      title: 'Physics - Newton\'s Laws',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: '38:45',
      views: 203,
      url: 'https://example.com/recording3'
    }
  ])

  const handleCreateMeeting = () => {
    if (!meetingTitle.trim() || !scheduledTime) return
    
    const newMeeting = {
      id: Date.now(),
      title: meetingTitle,
      description: meetingDescription,
      scheduledTime: scheduledTime,
      duration: parseInt(duration),
      isRecording,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    }
    
    if (onCreate) {
      onCreate(newMeeting)
    }
    
    // Reset form
    setMeetingTitle('')
    setMeetingDescription('')
    setScheduledTime('')
    setDuration('60')
    setIsRecording(true)
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* Create Meeting Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Schedule Meeting</h3>
              <p className="text-sm text-gray-500">Create a new class meeting</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Meeting title"
            className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
          />
          
          <textarea
            value={meetingDescription}
            onChange={(e) => setMeetingDescription(e.target.value)}
            placeholder="Meeting description (optional)"
            className="w-full min-h-20 p-3 mb-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Scheduled Time</label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Duration (minutes)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="recording"
              checked={isRecording}
              onChange={(e) => setIsRecording(e.target.checked)}
              className="w-4 h-4 text-[#356AC3] focus:ring-[#356AC3] border-gray-300 rounded"
            />
            <label htmlFor="recording" className="text-sm text-gray-700">
              Enable recording for this meeting
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Shivam Kumar</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleCreateMeeting}
              className="px-6 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!meetingTitle.trim() || !scheduledTime}
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Settings */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-xs font-medium text-gray-700 mb-2">Meeting Settings</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Waiting Room</label>
            <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent">
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Join Before Host</label>
            <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Class
export { MeetingDisplay, RecordingDisplay }