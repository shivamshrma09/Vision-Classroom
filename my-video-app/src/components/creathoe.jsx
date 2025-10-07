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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:4000'
});



export default function ClassroomCard({ classData = {
  name: "Mathematics Class 10th",
  createdDate: "December 15, 2024",
  studentCount: 25,
  classCode: "MATH10A",
  description: "Advanced mathematics course covering algebra, geometry, and calculus fundamentals for 10th grade students."
} }) {
  const navigate = useNavigate();
  
  const copyClassCode = () => {
    navigator.clipboard.writeText(classData.classCode);
    alert('Class code copied!');
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
    <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#356AC3' }} aria-label="class">
            {classData.name.charAt(0)}
          </Avatar>
        }
action={null}
        title={classData.name}
        subheader={`Created: ${classData.createdDate}`}
      />
      <CardMedia
        component="img"
        height="194"
        image="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=200&fit=crop"
        alt="Classroom"
      />
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        
         
        </div>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {classData.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleEnterClass}
          sx={{ backgroundColor: '#356AC3', '&:hover': { backgroundColor: '#2c5aa0' } }}
        > 
          Enter Class
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<ContentCopyIcon />}
          onClick={copyClassCode}
          sx={{ borderColor: '#356AC3', color: '#356AC3', marginLeft: '8px' }}
        >
          Copy Code
        </Button>
      </CardActions>
    </Card>
  );
}