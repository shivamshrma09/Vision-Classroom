import React from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

const ParticipantsList = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #444',
        color: 'white'
      }}>
        <h4 style={{ margin: 0, fontSize: '16px' }}>
          Participants ({participants.length})
        </h4>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px'
      }}>
        {participants.map((participant) => (
          <div
            key={participant.sessionId}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              marginBottom: '8px',
              background: '#3a3a3a',
              borderRadius: '8px',
              color: 'white'
            }}
          >
            <img
              src={participant.image || `https://getstream.io/random_svg/?id=${participant.userId}`}
              alt={participant.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '12px',
                border: '2px solid #4CAF50'
              }}
            />
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}>
                {participant.name || participant.userId}
                {participant.isLocalParticipant && (
                  <span style={{
                    fontSize: '12px',
                    color: '#4CAF50',
                    marginLeft: '8px'
                  }}>
                    (You)
                  </span>
                )}
              </div>
              
              <div style={{
                fontSize: '12px',
                color: '#888',
                display: 'flex',
                gap: '8px'
              }}>
                <span>
                  {participant.publishedTracks.includes('video') ? '📹' : '📹❌'}
                </span>
                <span>
                  {participant.publishedTracks.includes('audio') ? '🎤' : '🎤❌'}
                </span>
                {participant.isSpeaking && (
                  <span style={{ color: '#4CAF50' }}>🔊</span>
                )}
              </div>
            </div>
            
            <div style={{
              fontSize: '12px',
              color: '#888'
            }}>
              {participant.connectionQuality && (
                <div>
                  Signal: {participant.connectionQuality === 'excellent' ? '🟢' : 
                          participant.connectionQuality === 'good' ? '🟡' : '🔴'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        padding: '15px',
        borderTop: '1px solid #444',
        color: '#888',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        💡 Tip: Click video/audio icons to control your media
      </div>
    </div>
  );
};

export default ParticipantsList;