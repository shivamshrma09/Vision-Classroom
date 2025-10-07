const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");

async function getprofile(req, res) {
  try {
    const token = req.headers.token;
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by ID from token
    const user = await userModel.findById(decoded._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password and return user data
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

module.exports = { getprofile };