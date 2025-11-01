import React, { useState , useEffect } from "react";
import ClassroomCard from "./creathoe";
import Sidebar from "./Sidebar";
import StudyMaterials from "./StudyMaterials";
import DailyScheduleCard from "./DailyScheduleCard";
import axios from "axios";
import { useUser } from "../hooks/useUser";
import { FaRobot, FaQuestionCircle } from 'react-icons/fa';

const QuizInterface = ({ quizData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctAnswers = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / quizData.questions.length) * 100);
    
    // Send results via email
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
      });
      
      await axiosInstance.post('/gemini/send-quiz-results', {
        email: user.email,
        quizTitle: quizData.quizTitle,
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: quizData.questions.length,
        answers: selectedAnswers,
        questions: quizData.questions
      });
    } catch (error) {
      console.error('Failed to send quiz results:', error);
    }
    
    setShowResult(true);
  };

  if (showResult) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: '#10B981', marginBottom: '20px' }}>Quiz Completed!</h2>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>Results have been sent to your email.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#356AC3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>Question {currentQuestion + 1} of {quizData.questions.length}</span>
      </div>
      
      <h3 style={{ fontSize: '20px', marginBottom: '25px', color: '#374151' }}>
        {question.question}
      </h3>
      
      <div style={{ marginBottom: '30px' }}>
        {question.options?.map((option, index) => (
          <div
            key={index}
            onClick={() => handleAnswerSelect(currentQuestion, index)}
            style={{
              padding: '15px',
              margin: '10px 0',
              border: '2px solid ' + (selectedAnswers[currentQuestion] === index ? '#356AC3' : '#e5e7eb'),
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedAnswers[currentQuestion] === index ? '#f0f7ff' : 'white',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontWeight: '500', marginRight: '10px' }}>{String.fromCharCode(65 + index)})</span>
            {option}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: currentQuestion === 0 ? '#e5e7eb' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {Object.keys(selectedAnswers).length} / {quizData.questions.length} answered
        </div>
        
        {currentQuestion === quizData.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              padding: '10px 20px',
              backgroundColor: '#356AC3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
});

function Classroomenter() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [cRcode, setCRcode] = useState("");
  const [classroomsdata, setClassroomsdata] = useState("");
  const [cRName, setCRName] = useState("");
  const [cRDescription, setCRDescription] = useState("");
  const [cRsubject, setCRsubject] = useState("");
  const [userollnumber , setUserollnumber] = useState("");
  const [showStudyMaterials, setShowStudyMaterials] = useState(false);
  const [selectedClassroomForMaterials, setSelectedClassroomForMaterials] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const { user, loading } = useUser();
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMode, setAiMode] = useState('quiz');
  const [quizData, setQuizData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentView, setCurrentView] = useState('classrooms');
  const [quizSubject, setQuizSubject] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState('5');
  const [quizDifficulty, setQuizDifficulty] = useState('medium');
  const [quizDuration, setQuizDuration] = useState('15');
  const [quizEmail, setQuizEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todosByDate, setTodosByDate] = useState({});
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [schedulesByDate, setSchedulesByDate] = useState({});
  const [todoHeading, setTodoHeading] = useState('My Todos');
  const [editingHeading, setEditingHeading] = useState(false);

  const handleCreateClass = () => {
    setModalType("create");
    setShowModal(true);
  };

  const handleJoinClass = () => {
    setModalType("join");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        alert("Please login first");
        return;
      }

      const userId = user.id || user._id;
      const response = await axiosInstance.post("/classroom/creat-classroom", {
        adminname: user.name,
        adminId: userId,
        CRName: cRName,
        CRDescription: cRDescription,
        CRsubject: cRsubject,
      });
      
      alert("Classroom created successfully!");
      setShowModal(false);
      setCRName('');
      setCRDescription('');
      setCRsubject('');
      classroomdata(); 
    } catch (error) {
      console.error("Create classroom error:", error);
      alert("Failed to create classroom");
    }
  };

  const classroomdata = async () => {
    try {
      const userId = user.id || user._id;
      const response = await axiosInstance.post("/classroom/classroom-data", {
        userid: userId,
      });
      setClassroomsdata(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        alert("Please login first");
        return;
      }

      const userId = user.id || user._id;
      const response = await axiosInstance.post("/classroom/join-classroom", {
        adminId: userId,
        CRcode: cRcode,
        userollnumber: userollnumber
      });

      alert("Joined classroom successfully!");
      setShowModal(false);
      setCRcode('');
      setUserollnumber('');
      classroomdata(); 
    } catch (error) {
      console.error("Join classroom error:", error);
      alert("Failed to join classroom");
    }
  };

  const fetchStudyMaterials = async (classroomId) => {
    try {
      if (classroomId === 'general-storage') {
        const allMaterials = [];
        const classrooms = classroomsdata?.classrooms || [];
        
        for (const classroom of classrooms) {
          try {
            const response = await axiosInstance.get(`/api/study-materials/classroom/${classroom._id}`);
            allMaterials.push(...(response.data.data || []));
          } catch (error) {
            console.error(`Error fetching materials for ${classroom.CRName}:`, error);
          }
        }
        setStudyMaterials(allMaterials);
      } else {
        const response = await axiosInstance.get(`/api/study-materials/classroom/${classroomId}`);
        setStudyMaterials(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching study materials:', error);
    }
  };

  const handleShowStudyMaterials = (classroom) => {
    setSelectedClassroomForMaterials(classroom);
    setShowStudyMaterials(true);
    fetchStudyMaterials(classroom._id);
  };

  useEffect(() => {
    if (user && !loading) {
      classroomdata();
      fetchTodos(selectedDate);
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && !loading) {
      fetchTodos(selectedDate);
    }
  }, [selectedDate, user, loading]);

  const generateQuiz = async () => {
    if (!quizSubject.trim() || !quizTopic.trim()) {
      alert('Please fill in subject and topic fields');
      return;
    }
    
    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/gemini/generate-student-quiz', {
        topic: quizTopic,
        subject: quizSubject,
        numberOfQuestions: parseInt(quizQuestions),
        difficulty: quizDifficulty,
        email: quizEmail || user?.email
      });
      
      setQuizData(response.data);
      alert(`Quiz generated and sent to ${quizEmail || user?.email}!`);
    } catch (error) {
      console.error('Quiz generation error:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };



  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/api/todos', {
        text: newTodoText,
        time: newTodoTime,
        date: selectedDate
      }, {
        headers: { token }
      });
      
      if (response.data.success) {
        fetchTodos(selectedDate);
        setNewTodoText('');
        setNewTodoTime('');
        setShowAddTodo(false);
        
        // Set reminder if time is specified
        if (newTodoTime) {
          const reminderTime = new Date(`${selectedDate}T${newTodoTime}`);
          const now = new Date();
          const timeDiff = reminderTime.getTime() - now.getTime();
          
          if (timeDiff > 0) {
            setTimeout(() => {
              alert(`Reminder: ${newTodoText}`);
            }, timeDiff);
          }
        }
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo');
    }
  };

  const toggleTodo = async (id, date) => {
    try {
      const token = localStorage.getItem('token');
      const todo = todosByDate[date]?.find(t => t._id === id);
      
      const response = await axiosInstance.put(`/api/todos/${id}`, {
        completed: !todo.completed
      }, {
        headers: { token }
      });
      
      if (response.data.success) {
        fetchTodos(date);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update todo');
    }
  };

  const deleteTodo = async (id, date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.delete(`/api/todos/${id}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        fetchTodos(date);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  const fetchTodos = async (date) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/api/todos?date=${date}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setTodosByDate(prev => ({
          ...prev,
          [date]: response.data.todos
        }));
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  return (
    <div>
      <Sidebar 
        classrooms={classroomsdata?.classrooms || []} 
        onShowStudyMaterials={handleShowStudyMaterials}
        showStudyMaterials={showStudyMaterials}
        setShowStudyMaterials={setShowStudyMaterials}
        onSelectView={setCurrentView}
        currentView={currentView}
        userTodos={todosByDate[selectedDate] || []}
        onToggleTodo={(id) => toggleTodo(id, selectedDate)}
        userSchedule={schedulesByDate[selectedDate] || []}
      />
      <div style={{
        flex: 1,
        padding: "30px",
        backgroundColor: "#f8f9fa",
        marginLeft: 300,
        marginTop: -700,
      }}>
        
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 1000,
        }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowModal(!showModal)}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#356AC3",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "24px", color: "white", fontWeight: "bold" }}>+</span>
            </button>

            {showModal && (
              <div style={{
                position: "absolute",
                bottom: "70px",
                right: "0",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "8px",
                minWidth: "150px",
              }}>
                <button onClick={handleCreateClass} style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}>
                  Create Class
                </button>
                <button onClick={handleJoinClass} style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}>
                  Join Class
                </button>
              </div>
            )}
          </div>
        </div>


        {!showStudyMaterials ? (
          currentView === 'classrooms' ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px",
              justifyItems: "center",
              alignItems: "start",
              padding: "16px",
              marginTop: "16px",
              marginRight: "16px"
            }}>
              {classroomsdata?.classrooms?.map((classroom) => (
                <ClassroomCard
                  key={classroom._id}
                  classData={{
                    _id: classroom._id,
                    name: classroom.CRName,
                    createdDate: new Date(classroom.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }),
                    studentCount: classroom.students?.length || 0,
                    classCode: classroom.CRcode,
                    description: classroom.CRDescription,
                    subject: classroom.CRsubject,
                    adminName: classroom.adminname,
                    adminId: classroom.adminId
                  }}
                />
              )) || []}
            </div>
          ) : currentView === 'upload' ? (
            <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '16px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  color: '#1f2937', 
                  textAlign: 'center', 
                  fontSize: '18px', 
                  fontWeight: '600'
                }}>
                  📚 Upload Study Material
                </h3>
                
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid #e2e8f0',
                  marginBottom: '16px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#1f2937' 
                    }}>Title:</label>
                    <input
                      type="text"
                      placeholder="Enter title..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#1f2937' 
                    }}>Category:</label>
                    <select style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}>
                      <option>Other</option>
                      <option>Notes</option>
                      <option>Assignment</option>
                      <option>Reference</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#1f2937' 
                    }}>File:</label>
                    <input
                      type="file"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#356AC3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Upload Material
                  </button>
                </div>
              </div>
            </div>
          ) : currentView === 'todos' ? (
            <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '16px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 
                  onClick={() => setEditingHeading(true)}
                  style={{ 
                    margin: '0 0 12px 0', 
                    color: '#1f2937', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {editingHeading ? (
                    <input
                      type="text"
                      value={todoHeading}
                      onChange={(e) => setTodoHeading(e.target.value)}
                      onBlur={() => setEditingHeading(false)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setEditingHeading(false);
                        }
                      }}
                      autoFocus
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                        border: 'none',
                        outline: 'none',
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        borderBottom: '1px solid #356AC3'
                      }}
                    />
                  ) : (
                    `📝 ${todoHeading}`
                  )}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px',
                  padding: '8px 0'
                }}>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid #356AC3',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => setShowAddTodo(true)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#356AC3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add
                  </button>
                </div>

                {showAddTodo && (
                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e2e8f0',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="What to do?"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <input
                        type="time"
                        value={newTodoTime}
                        onChange={(e) => setNewTodoTime(e.target.value)}
                        style={{
                          padding: '8px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={addTodo}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#356AC3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddTodo(false);
                          setNewTodoText('');
                          setNewTodoTime('');
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {(!todosByDate[selectedDate] || todosByDate[selectedDate].length === 0) ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    No todos for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {todosByDate[selectedDate].map((todo) => (
                      <div
                        key={todo.id}
                        style={{
                          backgroundColor: todo.completed ? '#f0f9ff' : '#ffffff',
                          border: `1px solid ${todo.completed ? '#93c5fd' : '#e5e7eb'}`,
                          borderRadius: '6px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo._id, selectedDate)}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '14px',
                            color: todo.completed ? '#6b7280' : '#1f2937',
                            textDecoration: todo.completed ? 'line-through' : 'none'
                          }}>
                            {todo.text}
                          </div>
                          {todo.time && (
                            <div style={{
                              fontSize: '12px',
                              color: '#356AC3',
                              marginTop: '2px'
                            }}>
                              ⏰ {todo.time}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTodo(todo._id, selectedDate)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '2px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : currentView === 'quiz' ? (
            <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ margin: '0 0 15px 0', color: '#1f2937', textAlign: 'center', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#1f2937" strokeWidth="2"/>
                    <path d="M9,9h6v6h-6z" fill="#1f2937"/>
                    <circle cx="12" cy="12" r="2" fill="white"/>
                  </svg>
                  AI Quiz Generator
                </h2>
                
                <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Subject:</label>
                      <input
                        type="text"
                        placeholder="Physics"
                        value={quizSubject}
                        onChange={(e) => setQuizSubject(e.target.value)}
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
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Topic/Chapter:</label>
                      <input
                        type="text"
                        placeholder="laplace transformation"
                        value={quizTopic}
                        onChange={(e) => setQuizTopic(e.target.value)}
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
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <select 
                        value={quizQuestions}
                        onChange={(e) => setQuizQuestions(e.target.value)}
                        style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px',
                        outline: 'none'
                      }}>
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="15">15 Questions</option>
                        <option value="20">20 Questions</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <select 
                        value={quizDifficulty}
                        onChange={(e) => setQuizDifficulty(e.target.value)}
                        style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px',
                        outline: 'none'
                      }}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <select 
                        value={quizDuration}
                        onChange={(e) => setQuizDuration(e.target.value)}
                        style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px',
                        outline: 'none'
                      }}>
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="45">45 Minutes</option>
                        <option value="60">60 Minutes</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Send to:</label>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={quizEmail || user?.email || ''}
                      onChange={(e) => setQuizEmail(e.target.value)}
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
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={generateQuiz}
                    disabled={aiLoading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: aiLoading ? '#9ca3af' : '#356AC3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: aiLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {aiLoading ? 'Generating Quiz...' : 'Generate Quiz & Send Email'}
                  </button>
                </div>
                
                {quizData && (
                  <div style={{ marginTop: '30px' }}>
                    <QuizInterface quizData={quizData} />
                  </div>
                )}
              </div>
            </div>
          ) : null
        ) : (
          <StudyMaterials 
            classData={selectedClassroomForMaterials}
            isTeacher={true}
            onBack={() => {
              setShowStudyMaterials(false);
              setCurrentView('classrooms');
            }}
          />
        )}
      </div>

      {(modalType === "create" || modalType === "join") && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
                {modalType === "create" ? "Create Class" : "Join Class"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>×</span>
              </button>
            </div>

            <form onSubmit={modalType === 'create' ? handleSubmit : handleSubmit2}>
              {modalType === "create" ? (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={cRName}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                      placeholder="Enter class name"
                      required
                      onChange={(e) => setCRName(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                      Description
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                      placeholder="Enter class description"
                      required
                      value={cRDescription}
                      onChange={(e) => setCRDescription(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={cRsubject}
                      onChange={(e) => setCRsubject(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Class Code
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                    placeholder="Enter class code"
                    required
                    value={cRcode}
                    onChange={(e) => setCRcode(e.target.value)}
                  />
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", marginTop: "16px" }}>
                    Roll Number
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                    placeholder="Enter roll number"
                    required
                    value={userollnumber}
                    onChange={(e) => setUserollnumber(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#356AC3",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {modalType === "create" ? "Create Class" : "Join Class"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classroomenter;