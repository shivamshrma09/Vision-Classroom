const express = require('express');
const { body } = require("express-validator")
const router = express.Router();
const controllersauth = require('../controllers/controllers.auth')
const authMiddleware = require('../middlewares/authMiddleware');

// Send OTP route
router.post('/send-otp', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isLength({ min: 1 }).withMessage('Role is required'),
    body('strem').isLength({ min: 1 }).withMessage('Stream is required'),
], controllersauth.sendOTP);

// Verify OTP route
router.post('/verify-otp', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], controllersauth.verifyOTP);

// Register user route (after OTP verification)
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isLength({ min: 1 }).withMessage('Role is required'),
    body('strem').isLength({ min: 1 }).withMessage('Stream is required'),
], controllersauth.Singup);


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),



],
    controllersauth.login
)

router.get('/profile',  controllersauth.getprofile);

// OAuth routes
router.post('/auth/google', controllersauth.googleAuth);
router.post('/auth/linkedin', controllersauth.linkedinAuth);

module.exports = router;