import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import PeopleIcon from '@mui/icons-material/People';
import { IoEnterSharp } from 'react-icons/io5';
import { CiMenuKebab } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'
});



export default function ClassroomCard({ classData = {
  name: "Mathematics Class 10th",
  createdDate: "December 15, 2024",
  studentCount: 25,
  classCode: "MATH10A",
  description: "Advanced mathematics course covering algebra, geometry, and calculus fundamentals for 10th grade students."
} }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  
  const copyClassCode = () => {
    navigator.clipboard.writeText(classData.classCode);
    alert('Class code copied!');
    setShowMenu(false);
  };
  
  const leaveClassroom = async () => {
    if (window.confirm('Are you sure you want to leave this classroom?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id || user._id;
        
        const response = await axiosInstance.post('/classroom/leave-classroom', {
          classroomId: classData._id,
          userId: userId
        });
        
        alert('Left classroom successfully!');
        setShowMenu(false);
        window.location.reload();
      } catch (error) {
        console.error('Leave classroom error:', error);
        alert('Failed to leave classroom');
      }
    }
  };
  

  const handleEnterClass = () => {
    const classroomId = classData._id || classData.id;
    console.log(classData._id || classData.id)
    if (!classroomId) {
      alert('Classroom ID not found');
      return;
    }
    
    navigate(`/classrooms/${classroomId}`);
  };


  return (
    <div style={{ position: 'relative' }}>
      {showMenu && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998
          }}
          onClick={() => setShowMenu(false)}
        />
      )}
      <Card sx={{ maxWidth: 240, boxShadow: 1, borderRadius: 2, position: 'relative', overflow: 'visible' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#356AC3', width: 28, height: 28 }} aria-label="class">
            <img src="/LOGO.png" alt="CM" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
          </Avatar>
        }
        action={null}
        title={
          <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: '600' }}>
            {classData.name}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={{ fontSize: '11px', color: '#6b7280' }}>
            {classData.createdDate}
          </Typography>
        }
        sx={{ paddingBottom: '6px', paddingTop: '8px' }}
      />
      <CardMedia
        component="img"
        height="100"
        image="/LOGO.png"
        alt="Classroom Mitra"
        sx={{ 
          objectFit: 'contain', 
          backgroundColor: '#f8f9fa',
          padding: '12px'
        }}
      />
      <CardContent sx={{ paddingTop: '8px', paddingBottom: '6px', padding: '8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Chip 
            icon={<PeopleIcon />} 
            label={`${classData.studentCount || 0} Students`} 
            size="small" 
            sx={{ fontSize: '10px', height: '20px' }}
          />
        </div>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px', lineHeight: 1.3 }}>
          {classData.description?.substring(0, 60)}...
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ padding: '6px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleEnterClass}
          startIcon={<IoEnterSharp />}
          sx={{ 
            backgroundColor: '#356AC3', 
            '&:hover': { backgroundColor: '#2c5aa0' },
            fontSize: '11px',
            padding: '4px 8px',
            minWidth: 'auto'
          }}
        > 
          Enter
        </Button>
        
        <div style={{ position: 'relative' }}>
          <IconButton 
            onClick={() => setShowMenu(!showMenu)}
            sx={{ 
              padding: '4px',
              color: '#6b7280',
              '&:hover': { backgroundColor: '#f3f4f6' }
            }}
          >
            <CiMenuKebab size={18} />
          </IconButton>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
              zIndex: 9999,
              minWidth: '150px',
              marginTop: '4px'
            }}>
              <button
                onClick={copyClassCode}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '6px 6px 0 0'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Code
              </button>
              <button
                onClick={leaveClassroom}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ef4444',
                  borderRadius: '0 0 6px 6px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Leave Classroom
              </button>
            </div>
          )}
        </div>
      </CardActions>
    </Card>
    </div>
  );
}