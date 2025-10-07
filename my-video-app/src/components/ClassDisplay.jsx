import React, { useState } from 'react'
import { Video, Calendar, Clock, Users, Play, Download, Filter } from 'lucide-react'

function ClassDisplay({ meetings = [], recordings = [] }) {
  const [activeTab, setActiveTab] = useState('meetings')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAttendance, setShowAttendance] = useState(null)

  // Mock data if none provided
  const defaultMeetings = [
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
    },
    {
      id: 4,
      title: 'Biology Practical',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      participants: 0
    }
  ]

  const defaultRecordings = [
    {
      id: 1,
      title: 'Introduction to Calculus',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: '45:30',
      views: 156,
      thumbnail: 'https://via.placeholder.com/120x80/4facfe/ffffff?text=Video',
      url: 'https://example.com/recording1'
    },
    {
      id: 2,
      title: 'Organic Chemistry Basics',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      duration: '52:15',
      views: 89,
      thumbnail: 'https://via.placeholder.com/120x80/f093fb/ffffff?text=Video',
      url: 'https://example.com/recording2'
    },
    {
      id: 3,
      title: 'Physics - Newton\'s Laws',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: '38:45',
      views: 203,
      thumbnail: 'https://via.placeholder.com/120x80/667eea/ffffff?text=Video',
      url: 'https://example.com/recording3'
    },
    {
      id: 4,
      title: 'Advanced Mathematics',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      duration: '1:12:30',
      views: 342,
      thumbnail: 'https://via.placeholder.com/120x80/4facfe/ffffff?text=Video',
      url: 'https://example.com/recording4'
    }
  ]

  const displayMeetings = meetings.length > 0 ? meetings : defaultMeetings
  const displayRecordings = recordings.length > 0 ? recordings : defaultRecordings

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'past': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing': return 'Live'
      case 'upcoming': return 'Upcoming'
      case 'past': return 'Completed'
      default: return status
    }
  }

  const filteredMeetings = filterStatus === 'all' 
    ? displayMeetings 
    : displayMeetings.filter(meeting => meeting.status === filterStatus)

  return (
    <div className="w-full h-full">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'meetings'
              ? 'bg-white text-[#356AC3] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Meetings
        </button>
        <button
          onClick={() => setActiveTab('recordings')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'recordings'
              ? 'bg-white text-[#356AC3] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recordings
        </button>
      </div>

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div>
          {/* Filter */}
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#356AC3]"
            >
              <option value="all">All Meetings</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          {/* Meetings List */}
          <div className="space-y-3">
            {filteredMeetings.map(meeting => (
              <div key={meeting.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{meeting.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(meeting.scheduledTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(meeting.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{meeting.participants}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(meeting.status)}`}>
                      {getStatusText(meeting.status)}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-2">
                    {meeting.status === 'ongoing' && (
                      <button className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors font-medium">
                        Join Meeting
                      </button>
                    )}
                    {meeting.status === 'upcoming' && (
                      <>
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                          Start Early
                        </button>
                      </>
                    )}
                    {meeting.status === 'past' && meeting.recordingUrl && (
                      <button className="px-4 py-2 bg-[#356AC3] text-white text-sm rounded-lg hover:bg-[#356AC3]/90 transition-colors">
                        View Recording
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recordings Tab */}
      {activeTab === 'recordings' && (
        <div className="space-y-3">
          {displayRecordings.map(recording => (
            <div key={recording.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex space-x-3">
                  <div className="relative">
                    <img
                      src={recording.thumbnail}
                      alt={recording.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                      {recording.duration}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recording.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{new Date(recording.date).toLocaleDateString()}</span>
                      <span>{recording.views} views</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1.5 bg-[#356AC3] text-white text-sm rounded-lg hover:bg-[#356AC3]/90 transition-colors">
                        <Play className="w-3 h-3" />
                        <span>Play</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1.5 bg-[#356AC3] text-white text-sm rounded-lg hover:bg-[#356AC3]/90 transition-colors">
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                      <button 
                        onClick={() => setShowAttendance(recording.id)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Attendance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Attendance Modal */}
      {showAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Class Attendance</h3>
              <button
                onClick={() => setShowAttendance(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 1, name: 'Rahul Sharma', rollNo: '001', status: 'Present', joinTime: '10:05 AM' },
                { id: 2, name: 'Priya Singh', rollNo: '002', status: 'Present', joinTime: '10:02 AM' },
                { id: 3, name: 'Amit Kumar', rollNo: '003', status: 'Absent', joinTime: '-' },
                { id: 4, name: 'Sneha Patel', rollNo: '004', status: 'Present', joinTime: '10:08 AM' },
                { id: 5, name: 'Ravi Gupta', rollNo: '005', status: 'Present', joinTime: '10:01 AM' },
                { id: 6, name: 'Anita Sharma', rollNo: '006', status: 'Late', joinTime: '10:25 AM' },
                { id: 7, name: 'Vikash Singh', rollNo: '007', status: 'Present', joinTime: '10:03 AM' },
                { id: 8, name: 'Pooja Kumari', rollNo: '008', status: 'Absent', joinTime: '-' }
              ].map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#356AC3] flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{student.rollNo}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      student.status === 'Present' ? 'bg-green-100 text-green-800' :
                      student.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{student.joinTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassDisplay