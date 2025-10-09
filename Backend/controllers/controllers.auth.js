const userModel = require("../models/UserModel"); 
const jwt = require('jsonwebtoken');

async function Singup(req, res) {
  const { email, password, role, name, strem } = req.body;
  
  const userexiste = await userModel.findOne({ email }).select("+password");

  if (userexiste) {
    return res.status(400).send("User already exists");
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
  return res.status(201).json({ token, user, message: "Registration successful" });
}

async function login(req, res) {
  const { email, password } = req.body;

  const userexiste = await userModel.findOne({ email }).select("+password");
  if (!userexiste) {
    return res.status(404).send("Invalid Credentials");
  }

  const isMatch = await userexiste.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = userexiste.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ token });
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
  Singup,
  login,
  getprofile
};