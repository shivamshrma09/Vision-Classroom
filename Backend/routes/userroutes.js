const express = require('express');
const { body } = require("express-validator")
const router = express.Router();
const controllersauth = require('../controllers/controllers.auth')
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('name').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isLength({ min: 1 }).withMessage('  must be at least 6 characters long'),
    body('strem').isLength({ min: 1 }).withMessage(' must be at least 6 characters long'),



],
    controllersauth.Singup
)


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),



],
    controllersauth.login
)

router.get('/profile',  controllersauth.getprofile);





module.exports = router;