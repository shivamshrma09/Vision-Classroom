import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCloudUploadAlt, FaChevronDown, FaRobot, FaQuestionCircle } from 'react-icons/fa';
import { VscFeedback } from 'react-icons/vsc';
import { IoSettingsOutline } from 'react-icons/io5';
import axios from 'axios';
import Settings from './Settings';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
});

const Sidebar = ({ onSelectMenu, isTeacher, classData, activeMenu, onShowStudyMaterials, onSelectView, currentView, userTodos, onToggleTodo, userSchedule }) => {
  const location = useLocation();
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'other',
    file: null
  });
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMode, setAiMode] = useState('quiz');
  const [quizData, setQuizData] = useState(null);
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtAnswer, setDoubtAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showTodoSidebar, setShowTodoSidebar] = useState(false);
  
  const todos = userTodos || [];
  
  const isClassroomPage = location.pathname === '/classroom';
  const isIndividualClassroom = location.pathname.startsWith('/classrooms/');
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined' && userData !== 'null' && userData !== '[object Object]') {
        return JSON.parse(userData);
      }
      return {};
    } catch (error) {
      localStorage.removeItem('user');
      return {};
    }
  };
  
  const user = getUserFromStorage();
  
  useEffect(() => {
    fetchClassrooms();
  }, []);
  
  const fetchClassrooms = async () => {
    try {
      const user = getUserFromStorage();
      const userId = user.id || user._id;
      const response = await axiosInstance.post('/classroom/classroom-data', {
        userid: userId
      });
      setClassrooms(response.data.classrooms || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };
  
  const fetchStudyMaterials = async (classroomId) => {
    try {
      const response = await axiosInstance.get(`/api/study-materials/classroom/${classroomId}`);
      setStudyMaterials(response.data.data || []);
    } catch (error) {
      console.error('Error fetching study materials:', error);
    }
  };

  const handleClassroomChange = (classroomId) => {
    setSelectedClassroom(classroomId);
    if (classroomId) {
      fetchStudyMaterials(classroomId);
    } else {
      setStudyMaterials([]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedClassroom || !uploadData.file) {
      alert('Please select classroom and file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const token = localStorage.getItem('token');
        const fileData = reader.result.split(',')[1]; // Remove data:type;base64, prefix
        
        const response = await axiosInstance.post('/api/study-materials/upload', {
          title: uploadData.title,
          description: '',
          category: uploadData.category,
          classroomId: selectedClassroom,
          fileName: uploadData.file.name,
          fileType: uploadData.file.type,
          fileData: fileData,
          fileSize: uploadData.file.size
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        alert('File uploaded successfully!');
        setShowUploadModal(false);
        setUploadData({ title: '', category: 'other', file: null });
        fetchStudyMaterials(selectedClassroom);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload file');
      }
    };
    reader.readAsDataURL(uploadData.file);
  };

  const handleDownload = async (materialId, fileName) => {
    try {
      const response = await axiosInstance.get(`/api/study-materials/download/${materialId}`);
      
      const link = document.createElement('a');
      link.href = `data:${response.data.data.fileType};base64,${response.data.data.fileData}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/study-materials/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      alert('Material deleted successfully!');
      fetchStudyMaterials(selectedClassroom);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete material');
    }
  };

  const generateQuiz = async () => {
    const topic = prompt('Enter topic for quiz (e.g., "Photosynthesis"):');
    if (!topic) return;
    
    const subject = prompt('Enter subject (e.g., "Biology"):') || 'General';
    const numQuestions = prompt('Number of questions (1-10):') || '5';
    
    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/gemini/generate-student-quiz', {
        topic,
        subject,
        numberOfQuestions: parseInt(numQuestions),
        difficulty: 'medium'
      });
      
      setQuizData(response.data);
      setAiMode('quiz');
      setShowAIPanel(true);
    } catch (error) {
      console.error('Quiz generation error:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };



  const getTodaysDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const solveDoubt = async () => {
    if (!doubtQuestion.trim()) {
      alert('Please enter your question first');
      return;
    }
    
    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/gemini/solve-doubt', {
        question: doubtQuestion,
        subject: 'General',
        context: ''
      });
      
      setDoubtAnswer(response.data.answer);
    } catch (error) {
      console.error('Doubt solving error:', error);
      alert('Failed to solve doubt. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };
  
  const getHeaderTitle = () => {
    switch(activeMenu) {
      case 'dashboard': return 'Dashboard';
      case 'classes': return 'Classes';
      case 'tests': return 'Tests';
      case 'assignments': return 'Assignments';
        case 'attendence': return 'Attendence';
      case 'studyMaterials': return 'Study Materials';
      case 'feedback': return 'Feedback';
      default: return 'Dashboard';
    }
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
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
        <div style={{
          backgroundColor: '#356AC3',
          padding: '16px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/CM.png" alt="Classroom Mitra" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          Classroom Mitra
        </div>
        
        <div style={{ padding: '12px', flex: 1 }}>
          {/* Show menu items only for individual classroom pages */}
          {isIndividualClassroom && (
            <>
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
                    <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/>
                  </svg>
                  Attendance
                </div>
              )}
              

            </>
          )}
          
          {/* Study Material Section - Show on both pages */}
          <div style={{ marginTop: isIndividualClassroom ? '20px' : '0', paddingTop: isIndividualClassroom ? '20px' : '0', borderTop: isIndividualClassroom ? '1px solid #e5e7eb' : 'none' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#4b5563',
                letterSpacing: '0.3px'
              }}>
                Select Classroom:
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedClassroom}
                  onChange={(e) => {
                    const classroomId = e.target.value;
                    setSelectedClassroom(classroomId);
                    if (classroomId && classroomId !== 'storage') {
                      // Navigate to classroom
                      window.location.href = `/classrooms/${classroomId}`;
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 40px 14px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#356AC3';
                    e.target.style.boxShadow = '0 0 0 3px rgba(53, 106, 195, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                >
                  <option value="">Select Classroom</option>
                  {(classrooms || []).map((classroom) => (
                    <option key={classroom._id} value={classroom._id}>
                      {classroom.CRName}
                    </option>
                  ))}
                </select>
                <FaChevronDown 
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '12px',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
            
            <button
              onClick={() => {
                if (onSelectView) onSelectView('classrooms');
                if (onShowStudyMaterials) {
                  const storageClassroom = {
                    _id: 'general-storage',
                    CRName: 'My Study Materials',
                    CRDescription: 'Personal document storage'
                  };
                  onShowStudyMaterials(storageClassroom);
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#356AC3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#356AC3';
              }}
            >
              <FaCloudUploadAlt style={{ fontSize: '14px' }} />
              My Study Storage
            </button>
            
            {/* Quiz and Keep Notes Section - Only show on main dashboard */}
            {isClassroomPage && (
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onSelectView && onSelectView('quiz')}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      backgroundColor: currentView === 'quiz' ? '#356AC3' : 'transparent',
                      color: currentView === 'quiz' ? 'white' : '#356AC3',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaQuestionCircle size={12} />
                    Quiz
                  </button>
                  
                  <button
                    onClick={() => onSelectView && onSelectView('todos')}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      backgroundColor: currentView === 'todos' ? '#356AC3' : 'transparent',
                      color: currentView === 'todos' ? 'white' : '#356AC3',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,19H5V5H19V19Z"/>
                    </svg>
                    Keep Notes
                  </button>
                </div>
              </div>
            )}
            
            {/* My Todos Section */}
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#374151', textAlign: 'center' }}>
                📝 My Todos
              </h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: '#6b7280', textAlign: 'center' }}>
                {getTodaysDate()}
              </p>
              
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {todos.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 10px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px dashed #d1d5db'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 8px', opacity: 0.5 }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#9ca3af"/>
                    </svg>
                    <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0', fontStyle: 'italic' }}>
                      No todos for {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                  </div>
                ) : (
                  todos.map((todo) => (
                    <div key={todo._id || todo.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      marginBottom: '6px',
                      padding: '6px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggleTodo && onToggleTodo(todo._id || todo.id)}
                        style={{ width: '12px', height: '12px' }}
                      />
                      <span style={{ 
                        flex: 1, 
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#9ca3af' : '#374151',
                        fontSize: '10px'
                      }}>
                        {todo.text.length > 25 ? todo.text.substring(0, 25) + '...' : todo.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Today's Schedule Section */}
            {userSchedule && userSchedule.length > 0 && (
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#374151', textAlign: 'center' }}>
                  🕰️ Today's Schedule
                </h4>
                
                <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  {userSchedule.slice(0, 3).map((item) => (
                    <div key={item.id} style={{ 
                      marginBottom: '6px',
                      padding: '6px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}>
                      <div style={{
                        fontSize: '9px',
                        color: '#667eea',
                        fontWeight: '600',
                        marginBottom: '2px'
                      }}>
                        {item.time}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: item.completed ? '#9ca3af' : '#374151',
                        textDecoration: item.completed ? 'line-through' : 'none'
                      }}>
                        {item.task.length > 30 ? item.task.substring(0, 30) + '...' : item.task}
                      </div>
                    </div>
                  ))}
                  {userSchedule.length > 3 && (
                    <p style={{ fontSize: '9px', color: '#6b7280', textAlign: 'center', margin: '4px 0 0 0' }}>
                      +{userSchedule.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div style={{
          padding: '12px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
                {user.name ? user.name.charAt(0).toUpperCase() : 'SK'}
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
            <button
              onClick={() => setShowSettings(true)}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <IoSettingsOutline style={{ fontSize: '18px', color: '#6b7280' }} />
            </button>
          </div>
        </div>
      </div>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: '270px',
        right: 0,
        height: '64px',
        backgroundColor: '#356AC3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isIndividualClassroom && (
            <button
              onClick={() => onSelectMenu('feedback')}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <VscFeedback />
              Feedback
            </button>
          )}
          
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
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '380px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0 }}>Upload Study Material</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFileUpload}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                  Title:
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#356AC3'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>Category:</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="notes">Notes</option>
                  <option value="assignment">Assignment</option>
                  <option value="reference">Reference</option>
                  <option value="video">Video</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>File:</label>
                <input
                  type="file"
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#356AC3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#356AC3'}
              >
                <FaCloudUploadAlt />
                Upload Material
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default Sidebar;