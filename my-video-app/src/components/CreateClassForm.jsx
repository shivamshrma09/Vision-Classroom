import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  IconButton,
  Autocomplete
} from '@mui/material';
import { PhotoCamera, Close, School } from '@mui/icons-material';

const CreateClassForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    CRName: '',
    CRDescription: '',
    CRsubject: '',
    image: null
  });

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Art',
    'Music',
    'Physical Education'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      CRName: '',
      CRDescription: '',
      CRsubject: '',
      image: null
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <Card sx={{ 
        maxWidth: 550, 
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(53, 106, 195, 0.3)',
        borderRadius: '20px',
        border: '1px solid rgba(53, 106, 195, 0.1)'
      }}>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#356AC3' }}>
              Create New Class
            </Typography>
            <IconButton onClick={onClose} sx={{ color: '#666' }}>
              <Close />
            </IconButton>
          </Box>
        }
        sx={{ paddingBottom: '8px' }}
      />
      
      <CardContent sx={{ padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap="20px">
            
            {/* Image Upload */}
            <Box display="flex" flexDirection="column" alignItems="center" gap="16px">
              <div style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                <Avatar
                  src={formData.image}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    backgroundColor: '#356AC3',
                    fontSize: '28px',
                    boxShadow: '0 8px 24px rgba(53, 106, 195, 0.2)'
                  }}
                >
                  {formData.CRName.charAt(0) || <School sx={{ fontSize: '40px' }} />}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      backgroundColor: '#356AC3',
                      color: 'white',
                      width: 36,
                      height: 36,
                      '&:hover': {
                        backgroundColor: '#2c5aa0'
                      }
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: '18px' }} />
                  </IconButton>
                </label>
              </div>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Click the camera icon to upload class image
              </Typography>
            </Box>

            {/* Class Name */}
            <TextField
              fullWidth
              label="Class Name"
              name="CRName"
              value={formData.CRName}
              onChange={handleInputChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#356AC3',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#356AC3',
                },
              }}
            />

            {/* Subject */}
            <Autocomplete
              freeSolo
              options={subjects}
              value={formData.CRsubject}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  CRsubject: newValue || ''
                }));
              }}
              onInputChange={(event, newInputValue) => {
                setFormData(prev => ({
                  ...prev,
                  CRsubject: newInputValue
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subject"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#356AC3',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#356AC3',
                    },
                  }}
                />
              )}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Class Description"
              name="CRDescription"
              value={formData.CRDescription}
              onChange={handleInputChange}
              multiline
              rows={3}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#356AC3',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#356AC3',
                },
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#356AC3',
                '&:hover': { backgroundColor: '#2c5aa0' },
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: '600',
                padding: '12px'
              }}
            >
              Create Class
            </Button>
          </Box>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateClassForm;