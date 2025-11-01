import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'
});

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        alert('OAuth authentication failed: ' + error);
        navigate('/login');
        return;
      }

      if (!code) {
        alert('No authorization code received');
        navigate('/login');
        return;
      }

      try {
        let response;
        
        // Check if it's Google or LinkedIn callback
        if (location.pathname.includes('google')) {
          // Handle Google OAuth
          response = await axiosInstance.post('/users/auth/google', {
            code: code
          });
        } else if (location.pathname.includes('linkedin')) {
          // Handle LinkedIn OAuth
          response = await axiosInstance.post('/users/auth/linkedin', {
            code: code
          });
        }

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          
          if (response.data.user) {
            const userData = {
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role || 'student',
              strem: response.data.user.strem || 'General',
              _id: response.data.user._id,
              authProvider: response.data.user.authProvider,
              profilePicture: response.data.user.profilePicture
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          alert('Login successful!');
          navigate('/classroom');
        } else {
          alert('Authentication failed');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        alert('Authentication failed: ' + (error.response?.data?.message || error.message));
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#356AC3] mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
}

export default OAuthCallback;