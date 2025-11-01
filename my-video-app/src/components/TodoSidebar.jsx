import React from 'react';
import { FaCheck, FaClipboardList } from 'react-icons/fa';

const TodoSidebar = ({ todos, onToggleTodo, currentView, onSelectView }) => {
  const getLatestTodo = () => {
    if (todos.length === 0) return null;
    return todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };

  const latestTodo = getLatestTodo();

  if (currentView === 'todo') return null;

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      width: '300px',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      zIndex: 999
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaClipboardList size={16} color="#356AC3" />
          Latest TODO
        </h3>
        <button
          onClick={() => onSelectView('todo')}
          style={{
            padding: '6px 12px',
            backgroundColor: '#356AC3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          View All
        </button>
      </div>

      {latestTodo ? (
        <div style={{
          padding: '15px',
          backgroundColor: latestTodo.completed ? '#f1f5f9' : '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <button
              onClick={() => onToggleTodo(latestTodo.id)}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: latestTodo.completed ? 'none' : '2px solid #356AC3',
                backgroundColor: latestTodo.completed ? '#10b981' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                transition: 'all 0.2s ease'
              }}
            >
              {latestTodo.completed && <FaCheck size={10} />}
            </button>
            
            <div style={{ flex: 1 }}>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: '500',
                color: latestTodo.completed ? '#64748b' : '#1e293b',
                textDecoration: latestTodo.completed ? 'line-through' : 'none',
                lineHeight: '1.4'
              }}>
                {latestTodo.text.length > 50 ? latestTodo.text.substring(0, 50) + '...' : latestTodo.text}
              </p>
              
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                {latestTodo.date === new Date().toDateString() ? 'Today' : latestTodo.date} • {new Date(latestTodo.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
          <p style={{ margin: 0, fontSize: '13px' }}>No todos yet</p>
        </div>
      )}
    </div>
  );
};

export default TodoSidebar;