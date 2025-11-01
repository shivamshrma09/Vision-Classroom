import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaDownload, FaTrash, FaFileAlt, FaPlus, FaArrowLeft, FaFileDownload, FaRobot, FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
});

function StudyMaterials({ classData, isTeacher, onBack }) {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'other',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMode, setAiMode] = useState('quiz'); // 'quiz' or 'doubt'
  const [quizData, setQuizData] = useState(null);
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtAnswer, setDoubtAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchStudyMaterials();
  }, [classData]);

  const fetchStudyMaterials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axiosInstance.get('/api/study-materials/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const materials = response.data.data || [];
      setStudyMaterials(materials);
      setFilteredMaterials(materials);
    } catch (error) {
      console.error('Error fetching study materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadData.title || !uploadData.file) {
      alert('Please fill all fields');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'Found' : 'Missing');
        console.log('ClassData:', classData);
        
        const fileData = reader.result.split(',')[1];
        
        const uploadPayload = {
          title: uploadData.title,
          description: '',
          category: uploadData.category,
          classroomId: classData._id === 'general-storage' ? 'general-storage' : classData._id,
          fileName: uploadData.file.name,
          fileType: uploadData.file.type,
          fileData: fileData,
          fileSize: uploadData.file.size
        };
        
        console.log('Upload payload:', uploadPayload);
        
        const userUploadPayload = {
          title: uploadData.title,
          description: '',
          category: uploadData.category,
          fileName: uploadData.file.name,
          fileType: uploadData.file.type,
          fileData: fileData,
          fileSize: uploadData.file.size
        };
        
        const response = await axiosInstance.post('/api/study-materials/upload-user', userUploadPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Upload response:', response.data);

        alert('File uploaded successfully!');
        setUploadData({ title: '', category: 'other', file: null });
        fetchStudyMaterials();
        
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
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
      fetchStudyMaterials();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete material');
    }
  };

  const filterMaterials = (search, category, materials = studyMaterials) => {
    let filtered = materials;
    
    if (category !== 'all') {
      filtered = filtered.filter(material => material.category === category);
    }
    
    if (search) {
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(search.toLowerCase()) ||
        material.fileName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredMaterials(filtered);
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

  console.log('StudyMaterials render - isTeacher:', isTeacher);
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh', position: 'relative' }}>
      {/* AI Panel - Fixed Position */}
      {!isTeacher && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          width: '300px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #356AC3',
          zIndex: 100,
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <FaRobot style={{ fontSize: '24px', color: '#356AC3', marginBottom: '6px' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              AI Study Assistant
            </h3>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={generateQuiz}
              disabled={aiLoading}
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: aiLoading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <FaQuestionCircle /> {aiLoading ? 'Loading...' : 'Generate Quiz'}
            </button>
            <button
              onClick={() => {
                setAiMode('doubt');
                setShowAIPanel(true);
                setDoubtAnswer('');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: '#8B5CF6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <FaRobot /> Ask Doubt
            </button>
          </div>
          
          {showAIPanel && aiMode === 'quiz' && quizData && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1f2937' }}>
                {quizData.quizTitle}
              </h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {quizData.questions.map((q, index) => (
                  <div key={index} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '500' }}>
                      Q{index + 1}: {q.question}
                    </p>
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} style={{ 
                        fontSize: '11px', 
                        color: optIndex === q.correctAnswer ? '#10B981' : '#6b7280',
                        fontWeight: optIndex === q.correctAnswer ? '600' : '400'
                      }}>
                        {String.fromCharCode(65 + optIndex)}) {option}
                      </div>
                    ))}
                    {q.explanation && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#6b7280', fontStyle: 'italic' }}>
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {showAIPanel && aiMode === 'doubt' && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1f2937' }}>
                Ask Your Doubt
              </h4>
              <textarea
                value={doubtQuestion}
                onChange={(e) => setDoubtQuestion(e.target.value)}
                placeholder="Type your question here..."
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                  resize: 'none',
                  marginBottom: '8px'
                }}
              />
              <button
                onClick={solveDoubt}
                disabled={aiLoading || !doubtQuestion.trim()}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: aiLoading || !doubtQuestion.trim() ? '#9ca3af' : '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: aiLoading || !doubtQuestion.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {aiLoading ? 'Solving...' : 'Get Answer'}
              </button>
              
              {doubtAnswer && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px', 
                  backgroundColor: '#f0f9ff', 
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#1f2937' }}>Answer:</h5>
                  <p style={{ margin: 0, fontSize: '11px', color: '#374151', lineHeight: '1.4' }}>
                    {doubtAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Upload Card - Fixed Position (for teachers) */}
      {isTeacher && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          width: '280px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px dashed #e5e7eb',
          zIndex: 100
        }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <FaCloudUploadAlt style={{ fontSize: '24px', color: '#356AC3', marginBottom: '6px' }} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
            Upload Study Material
          </h3>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Title:</label>
              <input
                type="text"
                placeholder="Enter title..."
                value={uploadData.title}
                onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>Category:</label>
              <select
                value={uploadData.category}
                onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'white'
                }}
              >
                <option value="notes">Notes</option>
                <option value="assignment">Assignment</option>
                <option value="reference">Reference</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>File:</label>
          <input
            type="file"
            onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
            style={{
              width: '100%',
              padding: '6px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: '#f9fafb'
            }}
          />
        </div>
        
        <button
          onClick={handleFileUpload}
          disabled={!uploadData.title || !uploadData.file}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: uploadData.title && uploadData.file ? '#356AC3' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: uploadData.title && uploadData.file ? 'pointer' : 'not-allowed',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <FaPlus /> Upload Material
        </button>
        </div>
      )}

      {/* Header with Filters */}
      <div style={{ 
        marginBottom: '20px',
        marginRight: '300px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#356AC3',
              fontSize: '20px'
            }}
          >
            <FaArrowLeft />
          </button>
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '28px', fontWeight: '700' }}>
            Document Library
          </h2>
        </div>
        
        {/* Search and Filter Bar */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filterMaterials(e.target.value, selectedCategory);
            }}
            style={{
              flex: 1,
              padding: '10px 15px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              filterMaterials(searchTerm, e.target.value);
            }}
            style={{
              padding: '10px 15px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '120px'
            }}
          >
            <option value="all">All Categories</option>
            <option value="notes">Notes</option>
            <option value="assignment">Assignment</option>
            <option value="reference">Reference</option>
            <option value="video">Video</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Materials Container Box */}
      <div style={{
        marginRight: '300px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '500px',
        overflowY: 'auto',
        padding: '20px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <FaFileAlt style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }} />
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600' }}>
              {studyMaterials.length === 0 ? 'No study materials yet' : 'No materials found'}
            </h3>
            <p style={{ margin: 0, fontSize: '16px' }}>
              {studyMaterials.length === 0 ? 'Upload your first material using the card on the right' : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            paddingBottom: '20px',
            maxHeight: '100%',
            overflowY: 'auto'
          }}>
          {filteredMaterials.map((material) => (
            <div
              key={material._id}
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                height: 'fit-content'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '12px 16px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '35px',
                  height: '35px',
                  backgroundColor: '#356AC3',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px'
                }}>
                  <FaFileAlt />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {material.title}
                  </h4>
                  <p style={{
                    margin: '2px 0 0 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    Category: {material.category}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '0 16px 12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    backgroundColor: '#356AC3',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {material.category}
                  </span>
                </div>
                
                {/* Document Preview */}
                <div style={{
                  width: '100%',
                  height: '120px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  overflow: 'hidden'
                }}>
                  {material.fileData && material.fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                    <img 
                      src={`data:image/*;base64,${material.fileData}`}
                      alt="Document preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : material.fileData && material.fileName?.toLowerCase().endsWith('.pdf') ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#6b7280'
                    }}>
                      <FaFileAlt style={{ fontSize: '32px', marginBottom: '8px' }} />
                      <span style={{ fontSize: '12px' }}>PDF Document</span>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#6b7280'
                    }}>
                      <FaFileAlt style={{ fontSize: '32px', marginBottom: '8px' }} />
                      <span style={{ fontSize: '12px' }}>Document</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{
                padding: '8px 16px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleDownload(material._id, material.fileName)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#356AC3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FaFileDownload /> Download
                </button>
                
                {isTeacher && (
                  <button
                    onClick={() => handleDelete(material._id)}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyMaterials;