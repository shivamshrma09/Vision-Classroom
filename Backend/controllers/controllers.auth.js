const OtpModel = require("../models/OtpModel");
const userModel = require("../models/UserModel"); 
const crypto = require("crypto");
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken');



async function Singup(req, res) {
  const { email, password, role, otpuserenter, name, strem } = req.body;
  const Otpuserexiste = await OtpModel.findOne({ email });
  if (!Otpuserexiste) {
    return res.status(404).send("Invalid or expired OTP");
  }

  const otpExpiresAt = Otpuserexiste.createdAt.getTime() + 5 * 60 * 1000;

  if (otpExpiresAt < Date.now() || Otpuserexiste.otp !== otpuserenter) {
    return res.send("Invalid or expired OTP");
  }

  const userexiste = await userModel.findOne({ email }).select("+password");

  if (userexiste) {
    return res.status(404).send("Invalid Credentials");
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
  return res.status(201).json({ token, user, mas: "sjssjs" });
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








async function Otpsender(req, res) {
  try {
    const { name ,email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }

    const otp = crypto.randomInt(100000, 999999)

       const transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 465,
       secure: true, 
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
       }
     });
    



    const mailOptions = {
      from: process.env.SENDER_EMAIL, 
      to: `${name} <${email}>`, 
      replyTo: process.env.REPLY_TO, 
      subject: "Vision Classroom OTP",
      text: "Your OTP is"  +  " "+ `${otp}`, 
    };

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.response);


     const addotp = await OtpModel.create({
     email,
     otp
  });

    res
      .status(200)
      .json({ status: "success", message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({
      status: "error",
      message: "Error sending email, please try again.",
    });
  }
}

module.exports = {
  Singup,
  login,
  getprofile,
  Otpsender
};
