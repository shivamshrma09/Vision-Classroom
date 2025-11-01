import React, { useState, useEffect } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
});

function StudyMaterialSidebar({ classrooms }) {
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'other',
    file: null
  });

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
    
    if (!selectedClassroom) {
      alert('Please select a classroom first');
      return;
    }

    if (!uploadData.file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('category', uploadData.category);
    formData.append('classroomId', selectedClassroom);

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/api/study-materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert('File uploaded successfully!');
      setShowUploadModal(false);
      setUploadData({ title: '', description: '', category: 'other', file: null });
      fetchStudyMaterials(selectedClassroom);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  const handleDownload = async (materialId, fileName) => {
    try {
      const response = await axiosInstance.get(`/api/study-materials/download/${materialId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
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

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '300px',
      height: '100vh',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#3498db', marginBottom: '20px' }}>Vision Classroom</h2>
        
        {/* Classroom Dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Select Classroom:
          </label>
          <select
            value={selectedClassroom}
            onChange={(e) => handleClassroomChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#34495e',
              color: 'white',
              fontSize: '14px'
            }}
          >
            <option value="">All Classrooms</option>
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>
                {classroom.CRName}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Study Material Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          disabled={!selectedClassroom}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: selectedClassroom ? '#3498db' : '#7f8c8d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedClassroom ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            marginBottom: '20px'
          }}
        >
          📚 Upload Study Material
        </button>
      </div>

      {/* Study Materials List */}
      {selectedClassroom && (
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#ecf0f1' }}>
            Study Materials
          </h3>
          
          {studyMaterials.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#bdc3c7' }}>
              No materials uploaded yet
            </p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {studyMaterials.map((material) => (
                <div
                  key={material._id}
                  style={{
                    backgroundColor: '#34495e',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {material.title}
                  </div>
                  <div style={{ color: '#bdc3c7', marginBottom: '8px' }}>
                    {material.originalName}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDownload(material._id, material.originalName)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px'
                      }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
            color: 'black',
            padding: '24px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Title:
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Description:
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    minHeight: '60px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Category:
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="notes">Notes</option>
                  <option value="assignment">Assignment</option>
                  <option value="reference">Reference</option>
                  <option value="video">Video</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  File:
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Upload Material
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyMaterialSidebar;