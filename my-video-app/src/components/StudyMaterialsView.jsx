import React, { useState } from 'react';
import { FaCloudUploadAlt, FaArrowLeft, FaDownload, FaTrash, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
});

function StudyMaterialsView({ classroom, studyMaterials, onBack, onRefresh }) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'other',
    file: null
  });

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      alert('Please select a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const token = localStorage.getItem('token');
        const fileData = reader.result.split(',')[1];
        
        const response = await axiosInstance.post('/api/study-materials/upload', {
          title: uploadData.title,
          description: '',
          category: uploadData.category,
          classroomId: classroom._id || 'general-storage',
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
        setShowUploadForm(false);
        setUploadData({ title: '', category: 'other', file: null });
        onRefresh();
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
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete material');
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '10px',
              backgroundColor: '#356AC3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowLeft /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px' }}>
              {classroom.CRName} - Study Materials
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {studyMaterials.length} materials available
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowUploadForm(true)}
          style={{
            padding: '12px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <FaCloudUploadAlt /> Upload New Material
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
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
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
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
                onClick={() => setShowUploadForm(false)}
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
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
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
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Category:
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  File:
                </label>
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
                    backgroundColor: '#f9fafb'
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
                  gap: '8px'
                }}
              >
                <FaCloudUploadAlt /> Upload Material
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Materials Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {studyMaterials.map((material) => (
          <div
            key={material._id}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#356AC3',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FaFileAlt />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {material.title}
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                  {material.category} • {material.fileName}
                </p>
              </div>
            </div>
            
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
              Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
            </p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleDownload(material._id, material.fileName)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FaDownload /> Download
              </button>
              <button
                onClick={() => handleDelete(material._id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
        
        {studyMaterials.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <FaFileAlt style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No study materials yet</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Upload your first material to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyMaterialsView;