import React, { useState, useEffect } from 'react';
import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk';

const AttendanceTracker = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const call = useCall();
  
  const [attendance, setAttendance] = useState({});
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);

  useEffect(() => {
    if (!meetingStartTime) {
      setMeetingStartTime(new Date());
    }
  }, []);

  useEffect(() => {
    // Track participant join/leave times
    participants.forEach(participant => {
      const userId = participant.userId;
      const currentTime = new Date();
      
      if (!attendance[userId]) {
        setAttendance(prev => ({
          ...prev,
          [userId]: {
            name: participant.name || participant.userId,
            joinTime: currentTime,
            leaveTime: null,
            totalDuration: 0,
            isPresent: true
          }
        }));
      } else {
        setAttendance(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            isPresent: true
          }
        }));
      }
    });

    // Mark absent participants
    Object.keys(attendance).forEach(userId => {
      const isStillPresent = participants.some(p => p.userId === userId);
      if (!isStillPresent && attendance[userId].isPresent) {
        setAttendance(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            leaveTime: new Date(),
            isPresent: false,
            totalDuration: prev[userId].totalDuration + 
              (new Date() - new Date(prev[userId].joinTime)) / 1000 / 60 // minutes
          }
        }));
      }
    });
  }, [participants]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateAttendancePercentage = (userId) => {
    const user = attendance[userId];
    if (!user) return 0;
    
    const totalMeetingTime = (new Date() - meetingStartTime) / 1000 / 60; // minutes
    const userDuration = user.isPresent 
      ? user.totalDuration + (new Date() - new Date(user.joinTime)) / 1000 / 60
      : user.totalDuration;
    
    return Math.min(100, Math.round((userDuration / totalMeetingTime) * 100));
  };

  const exportAttendance = () => {
    const attendanceData = Object.entries(attendance).map(([userId, data]) => ({
      Name: data.name,
      'Join Time': data.joinTime ? new Date(data.joinTime).toLocaleTimeString() : 'N/A',
      'Leave Time': data.leaveTime ? new Date(data.leaveTime).toLocaleTimeString() : 'Still Present',
      'Duration': formatDuration(data.totalDuration),
      'Attendance %': `${calculateAttendancePercentage(userId)}%`,
      Status: data.isPresent ? 'Present' : 'Left'
    }));

    const csvContent = [
      Object.keys(attendanceData[0]).join(','),
      ...attendanceData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!showAttendance) {
    return (
      <button
        onClick={() => setShowAttendance(true)}
        style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        📊 Attendance
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      width: '90%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '15px'
      }}>
        <h3 style={{ margin: 0, fontSize: '20px', color: '#1f2937' }}>
          📊 Meeting Attendance
        </h3>
        <button
          onClick={() => setShowAttendance(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ✕
        </button>
      </div>

      {/* Meeting Info */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span><strong>Meeting ID:</strong> {call?.id}</span>
          <span><strong>Start Time:</strong> {meetingStartTime?.toLocaleTimeString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Current Participants:</strong> {participants.length}</span>
          <span><strong>Total Tracked:</strong> {Object.keys(attendance).length}</span>
        </div>
      </div>

      {/* Attendance List */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>Participant Details</h4>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {Object.entries(attendance).map(([userId, data]) => (
            <div
              key={userId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                background: data.isPresent ? '#f0f9ff' : '#fef2f2',
                borderRadius: '8px',
                border: `1px solid ${data.isPresent ? '#bae6fd' : '#fecaca'}`
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>
                  {data.name}
                  <span style={{
                    marginLeft: '8px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    background: data.isPresent ? '#10b981' : '#ef4444',
                    color: 'white'
                  }}>
                    {data.isPresent ? 'PRESENT' : 'LEFT'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Joined: {new Date(data.joinTime).toLocaleTimeString()}
                  {data.leaveTime && ` • Left: ${new Date(data.leaveTime).toLocaleTimeString()}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>
                  {calculateAttendancePercentage(userId)}%
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {formatDuration(data.totalDuration)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '15px'
      }}>
        <button
          onClick={exportAttendance}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📥 Export CSV
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `Meeting Attendance Report\nMeeting ID: ${call?.id}\nTotal Participants: ${Object.keys(attendance).length}\nGenerated: ${new Date().toLocaleString()}`
            );
            alert('Attendance summary copied to clipboard!');
          }}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📋 Copy Summary
        </button>
      </div>

      {/* Statistics */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h5 style={{ margin: '0 0 10px 0', color: '#374151' }}>Quick Stats</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
              {participants.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Currently Present</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196F3' }}>
              {Object.keys(attendance).length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Joined</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b35' }}>
              {Math.round(Object.values(attendance).reduce((acc, user) => acc + calculateAttendancePercentage(user), 0) / Object.keys(attendance).length) || 0}%
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Attendance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;