import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ClassroomAccessGuard = ({ children }) => {
  const [verificationStatus, setVerificationStatus] = useState({
    isLoading: true,
    hasAccess: false,
    error: null
  });
  
  const { classroomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id || user.id;
        
        if (!userId) {
          setVerificationStatus({
            isLoading: false,
            hasAccess: false,
            error: 'Please login first'
          });
          return;
        }

        console.log('Verifying access for user:', userId, 'classroom:', classroomId);

        // Fetch user profile to check classroomcodes
        const response = await fetch(`http://localhost:4000/users/profile`, {
          headers: {
            'token': localStorage.getItem('token')
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        console.log('User profile data:', userData);

        // Check if classroom ID exists in user's classroomcodes array
        const hasAccess = userData.classroomcodes && userData.classroomcodes.includes(classroomId);
        
        console.log('Access check result:', {
          classroomId,
          userClassrooms: userData.classroomcodes,
          hasAccess,
          userData
        });

        if (!hasAccess) {
          setVerificationStatus({
            isLoading: false,
            hasAccess: false,
            error: 'You do not have access to this classroom'
          });
          return;
        }

        setVerificationStatus({
          isLoading: false,
          hasAccess: true,
          error: null
        });

      } catch (error) {
        console.error('Error verifying classroom access:', error);
        setVerificationStatus({
          isLoading: false,
          hasAccess: false,
          error: error.message
        });
      }
    };

    if (classroomId) {
      verifyAccess();
    }
  }, [classroomId]);

  // Loading state
  if (verificationStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#356AC3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!verificationStatus.hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{verificationStatus.error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/classroom')}
              className="w-full bg-[#356AC3] text-white px-4 py-2 rounded-lg hover:bg-[#356AC3]/90 transition-colors"
            >
              Go to My Classrooms
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Access granted - render children
  return children;
};

export default ClassroomAccessGuard;