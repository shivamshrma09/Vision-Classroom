import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Tooltip from "./Tooltip"

import axios from 'axios';
import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'
});



function Login() {
   const navigate = useNavigate();


 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/users/login", { email, password });
      

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        if (response.data.user) {

          const userData = {
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            strem: response.data.user.strem,
            _id: response.data.user._id
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        alert('Login successful!');
        window.location.href = '/classroom';
      } else {
        alert('Login successful but no token received');
      }
    } catch (error) {
      alert('Login failed!');
    }
  };

  // Google OAuth login
  const handleGoogleLogin = () => {
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

  // LinkedIn OAuth login
  const handleLinkedInLogin = () => {
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
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-xl font-bold tracking-tight text-[#356AC3]">Sign in to your account</h1>
          <p className="text-xs text-muted-foreground">
            Enter your email below to sign in to your account
          </p>
        </div>
        
        <div className="grid gap-4">
          <form>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Tooltip content="Enter your email address">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:border-[#356AC3] focus:ring-[#356AC3] h-10 w-full text-base"
                  />
                </Tooltip>
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <Tooltip content="Enter your password">
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      autoCapitalize="none"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus:border-[#356AC3] focus:ring-[#356AC3] h-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Tooltip>
              </div>
              <Button 
                className="bg-[#356AC3] hover:bg-blue-700 text-white font-semibold" 
                onClick={handleSubmit}
              >
                Sign In
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
                className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 font-semibold h-10 px-4 text-sm flex items-center justify-center w-full"
                onClick={handleGoogleLogin}
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
                Sign in with Google
              </div>
            </div>
            <div className="relative group">
              <Button 
                className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 font-semibold h-10 px-4 text-sm flex items-center justify-center w-full"
                onClick={handleLinkedInLogin}
              >
                <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="#0077B5" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Sign in with LinkedIn
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/singup"
            className="underline underline-offset-4 hover:text-[#356AC3] text-[#356AC3]"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login