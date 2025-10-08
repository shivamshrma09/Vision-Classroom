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
import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'
});



function Login() {
   const navigate = useNavigate();


 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        navigate('/classroom');
      } else {
        alert('Login successful but no token received');
      }
    } catch (error) {
      alert('Login failed!');
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
            <CardTitle className="text-2xl text-center">Login to your account
</CardTitle>
            <CardDescription className="text-center">
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-4">
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
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#356AC3] hover:underline">
                Forgot password?
              </a>
            </div>
            
                             <Button className="w-full bg-[#356AC3] hover:bg-[#356AC3]/90 mb-4"  onClick={handleSubmit}>
             Login
            </Button>



      
          </CardContent>
          
          <CardFooter>
            <div className="text-center text-sm text-muted-foreground w-full">
              Don't have an account? 
              <a href="/singup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Login