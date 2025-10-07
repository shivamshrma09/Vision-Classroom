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
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
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

router.post('/save-attendance', (req, res, next) => {
    console.log("Save attendance request body:", req.body);
    next();
}, feturesController.saveAttendance);

router.get('/get-attendance', feturesController.getAttendance);

module.exports = router;

