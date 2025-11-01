const userModel = require("../models/UserModel"); 
const OtpModel = require("../models/OtpModel");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { sendWelcomeEmail } = require('../services/emailService');

// Create transporter function
function createTransporter() {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Send email function
async function sendEmail(to, subject, html) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Generate OTP helper function
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP function
async function sendOTP(req, res) {
  try {
    const { email, name, password, role, strem } = req.body;
    
    // Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: "User already exists with this email" });
    }
    
    // Generate 6-digit OTP
    const otp = generateOTP();
    
    // Delete any existing OTP for this email
    await OtpModel.deleteOne({ email });
    
    // Save new OTP
    await OtpModel.create({ email, otp });
    
    // Send OTP via email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Classroom Mitra - OTP Verification</h2>
        <p>Hello ${name || 'User'},</p>
        <p>Your OTP for registration is:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
    
    // Try sending email first
    const emailSent = await sendEmail(email, 'Classroom Mitra - OTP Verification', emailHtml);
    
    if (emailSent) {
      console.log(`✅ Email sent successfully to ${email}`);
      return res.status(200).json({ 
        success: true, 
        message: "OTP sent successfully to your email"
      });
    } else {
      // Fallback to console
      console.log(`🔑 EMAIL FAILED - OTP for ${email}: ${otp}`);
      return res.status(200).json({ 
        success: true, 
        message: "OTP generated (check console - email service unavailable)",
        otp: otp // Development fallback
      });
    }
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}

// Verify OTP function
async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    
    // Find OTP record
    const otpRecord = await OtpModel.findOne({ email, otp });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
    
    // Check if OTP is expired (10 minutes)
    const otpAge = Date.now() - otpRecord.createdAt.getTime();
    if (otpAge > 10 * 60 * 1000) {
      await OtpModel.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    
    // Delete OTP after successful verification
    await OtpModel.deleteOne({ email });
    
    return res.status(200).json({ success: true, message: "OTP verified successfully" });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
}

// Register user function (after OTP verification)
async function Singup(req, res) {
  try {
    const { email, password, role, name, strem } = req.body;
    
    // Double check if user exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }
    
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({
      name,
      role,
      email,
      password: hashedPassword,
      strem,
    });
    
    const token = user.generateAuthToken();
    
    // Send welcome email
    await sendWelcomeEmail(email, name, role);
    
    return res.status(201).json({ token, user, message: "Registration successful" });
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: "Registration failed" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const userExists = await userModel.findOne({ email }).select("+password");
    if (!userExists) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    
    const isMatch = await userExists.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const token = userExists.generateAuthToken();
    
    res.cookie("token", token);
    res.status(200).json({ token, user: userExists });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Login failed" });
  }
}

// Google OAuth login
async function googleAuth(req, res) {
  try {
    const { code } = req.body;
    
    // Exchange code for access token
    const params = new URLSearchParams();
    params.append('client_id', process.env.GOOGLE_CLIENT_ID);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback');
    
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get user info
    const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
    const { email, name, picture } = userResponse.data;
    
    // Check if user exists
    let user = await userModel.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await userModel.create({
        name,
        email,
        role: 'student',
        authProvider: 'google',
        profilePicture: picture
      });
      
      // Send welcome email for new Google users
      await sendWelcomeEmail(email, name, 'student');
    }
    
    const authToken = user.generateAuthToken();
    return res.status(200).json({ token: authToken, user, message: "Google login successful" });
    
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ message: "Google authentication failed" });
  }
}

// LinkedIn OAuth login
async function linkedinAuth(req, res) {
  try {
    const { code } = req.body;
    
    // Exchange code for access token
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('client_id', process.env.LINKEDIN_CLIENT_ID);
    params.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);
    params.append('redirect_uri', process.env.LINKEDIN_REDIRECT_URI);
    
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get user profile using OpenID Connect
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const { name, email, picture } = profileResponse.data;
    
    // Check if user exists
    let user = await userModel.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await userModel.create({
        name,
        email,
        role: 'student',
        authProvider: 'linkedin',
        profilePicture: picture
      });
      
      // Send welcome email for new LinkedIn users
      await sendWelcomeEmail(email, name, 'student');
    }
    
    const authToken = user.generateAuthToken();
    return res.status(200).json({ token: authToken, user, message: "LinkedIn login successful" });
    
  } catch (error) {
    console.error('LinkedIn auth error:', error);
    return res.status(500).json({ message: "LinkedIn authentication failed" });
  }
}

async function getprofile(req, res) {
  try {
    const token = req.headers.token;
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await userModel.findById(decoded._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    return res.status(200).json(userWithoutPassword);
    
  } catch (error) {
    console.error('Profile error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    return res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  sendOTP,
  verifyOTP,
  Singup,
  login,
  getprofile,
  googleAuth,
  linkedinAuth
};