import { useState, useEffect } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'
});

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await axiosInstance.get('/users/profile', {
        headers: {
          'token': token
        }
      });
      
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { user, loading, refetch: fetchProfile };
};