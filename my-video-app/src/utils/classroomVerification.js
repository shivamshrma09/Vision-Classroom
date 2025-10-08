import { useState, useEffect } from 'react';


export const verifyClassroomAccess = async (userId, classroomId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/users/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    const userData = await response.json();
    console.log('User data for verification:', userData);
    
    const hasAccess = userData.classroomcodes && userData.classroomcodes.includes(classroomId);
    
    return {
      hasAccess,
      userStream: userData.strem,
      userData
    };
    
  } catch (error) {
    console.error('Error verifying classroom access:', error);
    return {
      hasAccess: false,
      error: error.message
    };
  }
};

export const useClassroomVerification = (classroomId) => {
  const [verificationStatus, setVerificationStatus] = useState({
    isLoading: true,
    hasAccess: false,
    userStream: null,
    error: null
  });
  
  useEffect(() => {
    const verifyAccess = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;
      
      if (!userId) {
        setVerificationStatus({
          isLoading: false,
          hasAccess: false,
          error: 'User not logged in'
        });
        return;
      }
      
      const result = await verifyClassroomAccess(userId, classroomId);
      
      setVerificationStatus({
        isLoading: false,
        hasAccess: result.hasAccess,
        userStream: result.userStream,
        error: result.error
      });
    };
    
    if (classroomId) {
      verifyAccess();
    }
  }, [classroomId]);
  
  return verificationStatus;
};