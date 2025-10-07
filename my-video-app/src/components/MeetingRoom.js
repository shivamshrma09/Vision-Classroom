import React, { useState } from 'react';
import {
  CallingState,
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  PaginatedGridLayout,
  useCall
} from '@stream-io/video-react-sdk';
import ParticipantsList from './ParticipantsList';
import ChatPanel from './ChatPanel';
import AttendanceTracker from './AttendanceTracker';

const MeetingRoom = ({ callId, onLeaveMeeting }) => {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const call = useCall();
  
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [layoutMode, setLayoutMode] = useState('speaker'); // 'speaker' or 'grid'

  if (callingState !== CallingState.JOINED) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: 'white',
        fontSize: '18px'
      }}>
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            🔄 Joining meeting...
          </div>
          <div style={{ textAlign: 'center', color: '#888' }}>
            Meeting ID: {callId}
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a1a' }}>
        {/* Header */}
        <div style={{
          padding: '10px 20px',
          background: '#2d2d2d',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #444'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>
              Classroom Mitra
            </h3>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Meeting ID: {callId} • {participantCount} participants
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setLayoutMode(layoutMode === 'speaker' ? 'grid' : 'speaker')}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {layoutMode === 'speaker' ? '📊 Grid' : '🎤 Speaker'}
            </button>
            
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              style={{
                background: showParticipants ? '#ff6b6b' : '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              👥 Participants
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              style={{
                background: showChat ? '#ff6b6b' : '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              💬 Chat
            </button>
            
            <AttendanceTracker />
            
            <button
              onClick={onLeaveMeeting}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              📞 Leave
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
          {/* Video Area */}
          <div style={{ 
            flex: 1, 
            position: 'relative',
            width: (showParticipants || showChat) ? 'calc(100% - 300px)' : '100%'
          }}>
            {layoutMode === 'speaker' ? (
              <SpeakerLayout participantsBarPosition='bottom' />
            ) : (
              <PaginatedGridLayout groupSize={9} />
            )}
          </div>

          {/* Side Panels */}
          {showParticipants && (
            <div style={{
              width: '300px',
              background: '#2d2d2d',
              borderLeft: '1px solid #444'
            }}>
              <ParticipantsList />
            </div>
          )}
          
          {showChat && (
            <div style={{
              width: '300px',
              background: '#2d2d2d',
              borderLeft: '1px solid #444'
            }}>
              <ChatPanel />
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{
          padding: '15px',
          background: '#2d2d2d',
          borderTop: '1px solid #444'
        }}>
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default MeetingRoom;