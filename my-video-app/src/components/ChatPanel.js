import React, { useState, useEffect, useRef } from 'react';
import { useCall } from '@stream-io/video-react-sdk';

const ChatPanel = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const call = useCall();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString(),
        isOwn: true
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // In a real app, you'd send this through Stream's chat or custom signaling
      // For demo, we'll just add it locally
    }
  };

  // Demo messages for illustration
  useEffect(() => {
    const demoMessages = [
      {
        id: 1,
        text: 'Welcome to the meeting! 👋',
        sender: 'System',
        timestamp: new Date().toLocaleTimeString(),
        isOwn: false,
        isSystem: true
      }
    ];
    setMessages(demoMessages);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #444',
        color: 'white'
      }}>
        <h4 style={{ margin: 0, fontSize: '16px' }}>
          💬 Meeting Chat
        </h4>
      </div>
      
      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.isOwn ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <div style={{
              background: message.isSystem ? '#4CAF50' : 
                         message.isOwn ? '#2196F3' : '#3a3a3a',
              color: 'white',
              padding: '10px 12px',
              borderRadius: message.isOwn ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
              fontSize: '14px',
              wordWrap: 'break-word'
            }}>
              {!message.isOwn && !message.isSystem && (
                <div style={{
                  fontSize: '12px',
                  color: '#ccc',
                  marginBottom: '4px',
                  fontWeight: 'bold'
                }}>
                  {message.sender}
                </div>
              )}
              <div>{message.text}</div>
              <div style={{
                fontSize: '10px',
                color: '#ccc',
                marginTop: '4px',
                textAlign: 'right'
              }}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div style={{
        padding: '15px',
        borderTop: '1px solid #444',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #555',
            borderRadius: '20px',
            background: '#3a3a3a',
            color: 'white',
            fontSize: '14px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          style={{
            background: newMessage.trim() ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          📤
        </button>
      </div>
      
      {/* Quick Actions */}
      <div style={{
        padding: '10px 15px',
        borderTop: '1px solid #444',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {['👍', '👏', '❤️', '😊', '🎉'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              const reactionMessage = {
                id: Date.now(),
                text: emoji,
                sender: 'You',
                timestamp: new Date().toLocaleTimeString(),
                isOwn: true
              };
              setMessages(prev => [...prev, reactionMessage]);
            }}
            style={{
              background: 'transparent',
              border: '1px solid #555',
              borderRadius: '15px',
              padding: '5px 8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatPanel;