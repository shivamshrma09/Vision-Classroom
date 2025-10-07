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
  baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:4000'
});

function Singup() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [strem, setStrem] = useState('');
  const [otpuserenter, setOtpuserenter] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/users/register", { 
        name,
        role,
        strem,
        otpuserenter,
        email,
        password
      });   
      console.log('Signup success:', response.data);
      
      console.log('Full response:', response.data);
      
      // Save token and user to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Create user object with proper structure
        const userData = {
          name: response.data.user?.name || name,
          email: response.data.user?.email || email,
          role: response.data.user?.role || role,
          strem: response.data.user?.strem || strem,
          _id: response.data.user?._id
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data stored:', userData);
        
        alert('Signup successful!');
        navigate('/classroom');
      } else {
        alert('Signup successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      alert('Signup failed!');
    }
  };


  
          

  const otpsender = async (e) => {
    e.preventDefault();
    if (!email || !name) {
      alert('Please enter name and email first');
      return;
    }
    try {
      const response = await axiosInstance.post("/users/send-emails", {
        email,
        name
      });
      console.log('OTP sent:', response.data);
      alert('OTP sent to your email!');
    } catch (error) {
      console.error('OTP error:', error.response?.data || error.message);
      alert('Failed to send OTP!');
    }
  }
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#356AC3] flex items-center justify-center">
            <h4 className="text-white font-bold text-xl">CM</h4>
          </div>
          <h1 className="text-2xl font-semibold text-[#356AC3]">Classroom Mitra</h1>
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
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="bg-[#356AC3]/90 hover:bg-[#356AC3] text-sm px-3"  onClick={otpsender}>
                  Send OTP
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
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
            
            <div className="grid gap-2">
              <Label htmlFor="otpuserenter" className="">OTP</Label>
              <Input 
                id="otpuserenter" 
                placeholder="Enter OTP" 
                value={otpuserenter}
                onChange={(e) => setOtpuserenter(e.target.value)}  
              />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the Terms and Conditions
              </label>
            </div>
            
            <Button 
              className="w-full bg-[#356AC3] hover:bg-[#356AC3]/90 mb-4"
              onClick={handleSubmit}
            >
              Sign up
            </Button>
            
            <div className="flex justify-center">
              <button 
                className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors"
                onClick={() => { console.log('Google button clicked') }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

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
