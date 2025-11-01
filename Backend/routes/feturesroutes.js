const express = require('express');
const router = express.Router();
const feturesController = require('../controllers/fetures');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log("File received in middleware:", file); // Log file details
        const allowedMimeTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/pjpeg',
            'application/pdf'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); 
        } else {
            cb(new Error('Only images (PNG, JPG) and PDFs are allowed!'), false); 
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/post', upload.single("image"), (req, res, next) => {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    next();
}, feturesController.post);



router.post('/material', upload.single("image"), (req, res, next) => {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file || req.file.size === 0) {
        console.error("Uploaded file is empty or missing. File details:", req.file);
        return res.status(400).json({ msg: "Uploaded file is empty or missing. Please upload a valid file." });
    }
    next();
}, feturesController.material);



router.post('/assignment', upload.single("image"), (req, res, next) => {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    next();
}, feturesController.assignment);

router.post('/test', (req, res, next) => {
    console.log("Request body:", req.body);

    if (!req.body.title || !req.body.questions || req.body.questions.length === 0) {
        return res.status(400).json({ msg: "Test title and questions are required." });
    }
    next();
}, feturesController.testgenerater);

router.post('/comment', (req, res, next) => {
    console.log("Comment request body:", req.body);
    next();
}, feturesController.addComment);

router.post('/assignment-comment', (req, res, next) => {
    console.log("Assignment comment request body:", req.body);
    next();
}, feturesController.addAssignmentComment);

router.post('/test-comment', (req, res, next) => {
    console.log("Test comment request body:", req.body);
    next();
}, feturesController.addTestComment);

router.post('/submit-test-result', (req, res, next) => {
    console.log("Test result submission:", req.body);
    next();
}, feturesController.submitTestResult);

router.get('/test-results/:CRcode/:testId', feturesController.getTestResults);

router.post('/submit-assignment', upload.single("file"), (req, res, next) => {
    console.log("Assignment submission request body:", req.body);
    console.log("Uploaded file:", req.file);
    next();
}, feturesController.submitAssignment);

router.get('/assignment-submissions/:assignmentId', feturesController.getAssignmentSubmissions);

router.post('/submit-feedback', (req, res, next) => {
    console.log("Feedback submission request body:", req.body);
    next();
}, feturesController.submitFeedback);

router.get('/feedbacks/:CRcode', feturesController.getFeedbacks);

router.put('/update-feedback-status', (req, res, next) => {
    console.log("Update feedback status request body:", req.body);
    next();
}, feturesController.updateFeedbackStatus);

router.post('/save-attendance', async (req, res) => {
    console.log('🚀 Attendance route called!');
    console.log('Request body:', req.body);
    
    const { date, attendanceData, CRcode, password } = req.body;
    
    try {
        const CreatedclassroomModel = require('../models/createdclassroomModel');
        const userModel = require('../models/UserModel');
        const bcrypt = require('bcryptjs');
        
        console.log('1. Looking for classroom with CRcode:', CRcode);
        
        // 1. Find classroom by CRcode
        const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
        if (!classroom) {
            console.log('❌ Classroom not found');
            return res.status(404).json({ msg: "Classroom not found" });
        }
        console.log('✅ Classroom found:', classroom.CRName);
        
        // 2. Find teacher by adminId
        console.log('2. Looking for teacher with adminId:', classroom.adminId);
        const teacher = await userModel.findById(classroom.adminId).select('+password');
        if (!teacher) {
            console.log('❌ Teacher not found');
            return res.status(404).json({ msg: "Teacher not found" });
        }
        console.log('✅ Teacher found:', teacher.name);
        console.log('Teacher has password:', !!teacher.password);
        
        // 3. Debug password comparison
        console.log('3. Password Debug:');
        console.log('Entered password:', password);
        console.log('Stored password hash:', teacher.password);
        
        // Hash the entered password and compare
        const enteredPasswordHash = await bcrypt.hash(password, 10);
        console.log('Entered password hash:', enteredPasswordHash);
        
        // Try both bcrypt.compare and direct comparison
        const bcryptResult = await bcrypt.compare(password, teacher.password);
        const directComparison = password === teacher.password;
        
        console.log('Bcrypt comparison result:', bcryptResult);
        console.log('Direct comparison result:', directComparison);
        
        // Use bcrypt comparison
        if (!bcryptResult) {
            console.log('❌ Password incorrect via bcrypt');
            return res.status(401).json({ msg: "Incorrect password" });
        }
        
        console.log('✅ Password correct, saving attendance...');
        
        // 4. Save attendance if password matches
        const processedAttendanceData = attendanceData.map(student => ({
            studentId: student.studentId,
            studentsrollnumber: student.studnetsrollnumber,
            studentName: student.studentName,
            status: student.status || 'absent'
        }));
        
        const existingAttendance = classroom.attendences.find(a => a.date === date);
        
        if (existingAttendance) {
            console.log('Updating existing attendance');
            existingAttendance.attendencelist = processedAttendanceData;
        } else {
            console.log('Creating new attendance record');
            classroom.attendences.push({
                date: date,
                attendencelist: processedAttendanceData
            });
        }
        
        await classroom.save();
        console.log('✅ Attendance saved successfully!');
        return res.status(200).json({ msg: "Attendance saved successfully" });
        
    } catch (error) {
        console.error('❌ Error in attendance route:', error);
        return res.status(500).json({ msg: "Server error: " + error.message });
    }
});

router.get('/get-attendance', feturesController.getAttendance);

// Profile routes
router.post('/update-profile-photo', upload.single('photo'), async (req, res) => {
    try {
        const { userId } = req.body;
        const userModel = require('../models/UserModel');
        
        if (!req.file) {
            return res.status(400).json({ msg: 'No photo uploaded' });
        }
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        user.profilePhoto = {
            data: req.file.buffer.toString('base64'),
            contentType: req.file.mimetype,
            originalName: req.file.originalname
        };
        
        await user.save();
        res.status(200).json({ msg: 'Profile photo updated successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
});

router.get('/user-profile/:userId', async (req, res) => {
    try {
        const userModel = require('../models/UserModel');
        const user = await userModel.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
});

// Notification routes
router.post('/send-notification', async (req, res) => {
    try {
        const { CRcode, message, type, teacherName } = req.body;
        const CreatedclassroomModel = require('../models/createdclassroomModel');
        
        const classroom = await CreatedclassroomModel.findOne({ CRcode });
        if (!classroom) {
            return res.status(404).json({ msg: 'Classroom not found' });
        }
        
        const notification = {
            message,
            type,
            teacherName,
            timestamp: new Date(),
            _id: new Date().getTime().toString()
        };
        
        if (!classroom.notifications) {
            classroom.notifications = [];
        }
        classroom.notifications.push(notification);
        
        await classroom.save();
        res.status(200).json({ msg: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
});

router.get('/notifications/:CRcode', async (req, res) => {
    try {
        const CreatedclassroomModel = require('../models/createdclassroomModel');
        const classroom = await CreatedclassroomModel.findOne({ CRcode: req.params.CRcode });
        
        if (!classroom) {
            return res.status(404).json({ msg: 'Classroom not found' });
        }
        
        res.status(200).json({ notifications: classroom.notifications || [] });
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
});

module.exports = router;

