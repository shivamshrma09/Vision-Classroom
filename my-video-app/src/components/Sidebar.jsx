import React from 'react';

const Sidebar = ({ onSelectMenu, isTeacher, classData, activeMenu }) => {
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined' && userData !== 'null' && userData !== '[object Object]') {
        return JSON.parse(userData);
      }
      return {};
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return {};
    }
  };
  
  const user = getUserFromStorage();
  
  const getHeaderTitle = () => {
    switch(activeMenu) {
      case 'dashboard': return 'Dashboard';
      case 'classes': return 'Classes';
      case 'tests': return 'Tests';
      case 'assignments': return 'Assignments';
        case 'attendence': return 'Attendence';
      case 'feedback': return 'Feedback';
      default: return 'Dashboard';
    }
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '270px',
        backgroundColor: 'white',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#356AC3',
          padding: '16px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Classroom Mitra
        </div>
        
        {/* Navigation */}
        <div style={{ padding: '12px', flex: 1 }}>
          <div 
            onClick={() => onSelectMenu('dashboard')}
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              backgroundColor: activeMenu === 'dashboard' ? '#356AC3' : 'transparent',
              color: activeMenu === 'dashboard' ? 'white' : '#356AC3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Dashboard
          </div>
          
          <div 
            onClick={() => onSelectMenu('classes')}
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              backgroundColor: activeMenu === 'classes' ? '#356AC3' : 'transparent',
              color: activeMenu === 'classes' ? 'white' : '#356AC3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
          Classes
          </div>
          
          <div 
            onClick={() => onSelectMenu('tests')}
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              backgroundColor: activeMenu === 'tests' ? '#356AC3' : 'transparent',
              color: activeMenu === 'tests' ? 'white' : '#356AC3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          Tests
          </div>
          
          <div 
            onClick={() => onSelectMenu('assignments')}
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              backgroundColor: activeMenu === 'assignments' ? '#356AC3' : 'transparent',
              color: activeMenu === 'assignments' ? 'white' : '#356AC3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,12H7V10H17V12M15,16H7V14H15V16M17,8H7V6H17V8Z"/>
          </svg>
          Assignments
          </div>
          


          {isTeacher && (
            <div 
              onClick={() => onSelectMenu('attendence')}
              style={{
                padding: '12px 16px',
                marginBottom: '8px',
                backgroundColor: activeMenu === 'attendence' ? '#356AC3' : 'transparent',
                color: activeMenu === 'attendence' ? 'white' : '#356AC3',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M17,12H7V10H17V12M15,16H7V14H15V16M17,8H7V6H17V8Z"/>
            </svg>
          Attendance
            </div>
          )}
          


          <div 
            onClick={() => onSelectMenu('feedback')}
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              backgroundColor: activeMenu === 'feedback' ? '#356AC3' : 'transparent',
              color: activeMenu === 'feedback' ? 'white' : '#356AC3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/>
          </svg>
          Feedback
          </div>
        </div>
        
        {/* User Info */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#356AC3',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '500'
            }}>
              SK
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {user.name || 'Shivam Kumar'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {isTeacher ? 'Teacher' : 'Student'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '270px',
        right: 0,
        height: '60px',
        backgroundColor: '#356AC3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 999
      }}>
        <div>
          <h1 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0
          }}>{getHeaderTitle()}</h1>
          {classData && (
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              margin: '4px 0 0 0'
            }}>Class Code: {classData.CRcode || classData.classCode}</p>
          )}
        </div>
        
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <span style={{
            color: '#356AC3',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>SK</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;