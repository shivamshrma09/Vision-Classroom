import React, { useState } from 'react'
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'
});

function Singup() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [strem, setStrem] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !role) {
      alert('Please fill all required fields');
      return;
    }
    
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    if (!termsAccepted) {
      alert('Please accept Terms and Conditions');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/register", { 
        name,
        role,
        strem,
        email,
        password
      });   

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        const userData = {
          name: response.data.user?.name || name,
          email: response.data.user?.email || email,
          role: response.data.user?.role || role,
          strem: response.data.user?.strem || strem,
          _id: response.data.user?._id
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        alert('Signup successful!');
        navigate('/classroom');
      } else {
        alert('Signup successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      alert('Signup failed! ' + (error.response?.data || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
            <img src="/LOGO.png" alt="Vision Classroom" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-[#356AC3]">Vision Classroom</h1>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name"  
                value={name}
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter password (min 6 characters)"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="tuition_teacher">Tuition Teacher</option>
                <option value="coaching_owner">Coaching Owner</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="strem">Stream</Label>
              <Input 
                id="strem" 
                placeholder="Enter your stream"    
                value={strem}
                onChange={(e) => setStrem(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required 
              />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the Terms and Conditions
              </label>
            </div>
            
            <Button 
              className="w-full bg-[#356AC3] hover:bg-[#356AC3]/90 mb-4"
              onClick={handleSubmit}
              disabled={loading || !termsAccepted}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>

          </CardContent>
          
          <CardFooter>
            <div className="text-center text-sm text-muted-foreground w-full">
              Already have an account? 
            <Link to="/login">
                <button
                type="button"
                className="underline underline-offset-4 hover:text-primary" 
              >
                Sign in
              </button></Link>
          
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Singup;