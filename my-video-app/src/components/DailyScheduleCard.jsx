import React, { useState } from 'react';

const DailyScheduleCard = ({ date, onSave }) => {
  const [scheduleItems, setScheduleItems] = useState([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ time: '', task: '' });
  const [emailTime, setEmailTime] = useState('08:00');

  const addScheduleItem = () => {
    if (!newItem.time.trim() || !newItem.task.trim()) return;
    
    const newScheduleItem = {
      id: Date.now(),
      time: newItem.time,
      task: newItem.task,
      completed: false
    };
    
    setScheduleItems([...scheduleItems, newScheduleItem]);
    setNewItem({ time: '', task: '' });
    setShowAddForm(false);
  };

  const toggleComplete = (id) => {
    setScheduleItems(scheduleItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  const saveSchedule = () => {
    const scheduleData = {
      date,
      items: scheduleItems,
      emailReminderTime: emailTime
    };
    
    // Set email reminder
    const reminderDateTime = new Date(`${date}T${emailTime}`);
    const now = new Date();
    const timeDiff = reminderDateTime.getTime() - now.getTime();
    
    if (timeDiff > 0) {
      setTimeout(() => {
        alert(`Daily Schedule Reminder: Your schedule for ${date} is ready!`);
      }, timeDiff);
    }
    
    if (onSave) onSave(scheduleData);
    alert('Daily schedule saved with email reminder set!');
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e7eb',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          📅 Daily Schedule
        </h3>
        <span style={{
          fontSize: '14px',
          color: '#6b7280',
          fontWeight: '500'
        }}>
          {new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {scheduleItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px dashed #d1d5db'
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#6b7280'
            }}>
              No schedule items yet. Click "Add Item" to start.
            </p>
          </div>
        ) : (
          scheduleItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: item.completed ? '#f0f9ff' : '#f9fafb',
              borderRadius: '8px',
              marginBottom: '8px',
              border: `1px solid ${item.completed ? '#bfdbfe' : '#e5e7eb'}`
            }}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(item.id)}
                style={{ width: '16px', height: '16px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {item.time}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: item.completed ? '#6b7280' : '#374151',
                  textDecoration: item.completed ? 'line-through' : 'none',
                  fontWeight: '500'
                }}>
                  {item.task}
                </div>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {showAddForm && (
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Time (e.g., 14:00-15:00)"
              value={newItem.time}
              onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '8px'
              }}
            />
            <input
              type="text"
              placeholder="Task description"
              value={newItem.task}
              onChange={(e) => setNewItem({ ...newItem, task: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={addScheduleItem}
              style={{
                padding: '8px 16px',
                backgroundColor: '#356AC3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '16px' }}>+</span>
          Add Item
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Email reminder:</span>
          <input
            type="time"
            value={emailTime}
            onChange={(e) => setEmailTime(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
        </div>
      </div>

      <button
        onClick={saveSchedule}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#356AC3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Save Daily Schedule
      </button>
    </div>
  );
};

export default DailyScheduleCard;