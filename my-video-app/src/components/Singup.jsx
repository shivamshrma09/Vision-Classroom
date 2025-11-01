import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Tooltip from "./Tooltip"
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [continueEmail, setContinueEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

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
      // Check if user already exists and send OTP
      const response = await axiosInstance.post("/users/send-otp", {
        name,
        email,
        password,
        role,
        strem
      });
      
      if (response.data.success) {
        alert('OTP sent to your email!');
        setShowOTP(true);
      } else {
        alert(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert('User already exists with this email!');
      } else {
        alert('Failed to send OTP: ' + (error.response?.data?.message || 'Please try again'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/verify-otp", { 
        email,
        otp: otpValue
      });   

      if (response.data.success) {
        // OTP verified, now register the user
        const registerResponse = await axiosInstance.post("/users/register", {
          name,
          role,
          strem,
          email,
          password
        });
        
        if (registerResponse.data.token) {
          localStorage.setItem('token', registerResponse.data.token);
          
          const userData = {
            name: registerResponse.data.user?.name || name,
            email: registerResponse.data.user?.email || email,
            role: registerResponse.data.user?.role || role,
            strem: registerResponse.data.user?.strem || strem,
            _id: registerResponse.data.user?._id
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          
          alert('Signup successful!');
          window.location.href = '/classroom';
        } else {
          alert('Registration completed! Please login.');
          window.location.href = '/login';
        }
      } else {
        alert('Invalid OTP! Please try again.');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Invalid or expired OTP!');
      } else {
        alert('Verification failed: ' + (error.response?.data?.message || 'Please try again'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Google OAuth signup
  const handleGoogleSignup = () => {
    const googleClientId = '1022210714474-b04nmoo09di6cugjuj4a6it3hnp800g7.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    const scope = encodeURIComponent('openid email profile');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    window.location.href = authUrl;
  };

  // LinkedIn OAuth signup
  const handleLinkedInSignup = () => {
    const linkedinClientId = '86y0zq0a37ppta';
    const redirectUri = window.location.origin + '/auth/linkedin/callback';
    const scope = 'openid profile email';
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `client_id=${linkedinClientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `state=random-state-string`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm space-y-4 border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
        {!showOTP && (
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-xl font-bold tracking-tight text-[#356AC3]">Create an account</h1>
            <p className="text-xs text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
        )}
        
        <div className="grid gap-4">
          {!showOTP ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="name"
                      placeholder="Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Input
                      id="strem"
                      placeholder="Stream"
                      type="text"
                      value={strem}
                      onChange={(e) => setStrem(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full text-base"
                  />
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-9 pr-8 text-sm w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                    <select 
                      id="role" 
                      className="h-9 flex-1 rounded-md border border-gray-300 bg-white px-2 text-sm focus:border-[#356AC3] focus:ring-[#356AC3] focus:outline-none"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Role</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="tuition_teacher">Tuition</option>
                      <option value="coaching_owner">Coach</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="rounded border-gray-300 text-[#356AC3]"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the Terms and Conditions
                    </label>
                  </div>
                  <Button 
                    className="bg-[#356AC3] hover:bg-blue-700 text-white font-semibold h-9 w-full" 
                    onClick={handleSubmit}
                    disabled={loading || !termsAccepted}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </div>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#356AC3] font-medium">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Button 
                    className="text-[#356AC3] bg-white border border-gray-300 hover:bg-gray-50 font-semibold h-10 px-4 text-sm flex items-center justify-center w-full"
                    onClick={handleGoogleSignup}
                  >
                    <svg className="mr-2 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Sign up with Google
                  </div>
                </div>
                <div className="relative group">
                  <Button 
                    className="text-[#356AC3] bg-white border border-gray-300 hover:bg-gray-50 font-semibold h-10 px-4 text-sm flex items-center justify-center w-full"
                    onClick={handleLinkedInSignup}
                  >
                    <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="#0077B5" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Sign up with LinkedIn
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#356AC3]">Enter Verification Code</h2>
                <p className="text-sm text-gray-600">We've sent a 6-digit code to your email</p>
              </div>
              
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:border-[#356AC3] focus:ring-[#356AC3] focus:outline-none text-lg font-semibold"
                  />
                ))}
              </div>
              
              <Button 
                className="bg-[#356AC3] hover:bg-blue-700 text-white font-semibold h-10 w-full" 
                onClick={handleOTPSubmit}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Your Account'}
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 hover:text-[#356AC3] text-[#356AC3]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Singup;
