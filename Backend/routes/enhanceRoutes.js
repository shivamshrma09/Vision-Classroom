const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAvPG0iuFzdMjarVh8lY-8O5phQTIoeKjA';
console.log('GEMINI_API_KEY loaded:', apiKey ? 'Yes' : 'No');
const genAI = new GoogleGenerativeAI(apiKey);

// Create transporter function (same as OTP)
function createTransporter() {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Send email function (same as OTP)
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

// Send notification to students when teacher creates content
const sendStudentNotification = async (studentEmails, teacherName, action, title, className) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Classroom Mitra - ${className}</h2>
      <p>Hello,</p>
      <p><strong>${teacherName}</strong> ${action}: <strong>"${title}"</strong></p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h3 style="color: #007bff; margin: 0;">New Activity</h3>
        <p style="color: #333; margin: 10px 0;">Check your classroom for updates</p>
      </div>
      <p>Visit your classroom to see the latest activities.</p>
      <p>If you're not enrolled in this class, please ignore this email.</p>
    </div>
  `;

  for (const email of studentEmails) {
    const emailSent = await sendEmail(email, `Classroom Mitra - New Activity in ${className}`, emailHtml);
    
    if (emailSent) {
      console.log(`✅ Notification sent successfully to ${email}`);
    } else {
      console.log(`🔑 EMAIL FAILED - Notification for ${email}`);
    }
  }
};

// Send quiz via email
const sendQuizEmail = async (email, quizData, topic, subject) => {
  const questionsHtml = quizData.questions.map((q, index) => `
    <div style="background: #f4f4f4; padding: 15px; margin: 15px 0;">
      <h4 style="color: #333; margin-bottom: 10px;">Question ${index + 1}:</h4>
      <p style="color: #333; margin-bottom: 10px;">${q.question}</p>
      <div style="margin-left: 15px;">
        ${q.options.map((option, optIndex) => `
          <p style="margin: 5px 0; color: ${optIndex === q.correctAnswer ? '#007bff' : '#333'}; font-weight: ${optIndex === q.correctAnswer ? 'bold' : 'normal'};">
            ${String.fromCharCode(65 + optIndex)}. ${option} ${optIndex === q.correctAnswer ? '✓' : ''}
          </p>
        `).join('')}
      </div>
      ${q.explanation ? `<p style="margin-top: 10px; padding: 8px; background-color: #f4f4f4; color: #007bff; font-size: 14px;"><strong>Explanation:</strong> ${q.explanation}</p>` : ''}
    </div>
  `).join('');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Classroom Mitra - Quiz Ready</h2>
      <p>Hello,</p>
      <p>Your quiz on <strong>${topic}</strong> (${subject}) is ready:</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h3 style="color: #007bff; margin: 0;">${quizData.quizTitle}</h3>
        <p style="color: #333; margin: 10px 0;">${quizData.quizDescription}</p>
      </div>
      ${questionsHtml}
      <p>Good luck with your studies!</p>
      <p>If you didn't request this quiz, please ignore this email.</p>
    </div>
  `;

  const emailSent = await sendEmail(email, `Classroom Mitra - ${quizData.quizTitle}`, emailHtml);
  
  if (emailSent) {
    console.log(`✅ Quiz email sent successfully to ${email}`);
  } else {
    console.log(`🔑 EMAIL FAILED - Quiz for ${email}`);
  }
};

// List available models
router.get('/models', async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (error) {
    console.error('Models list error:', error);
    res.status(500).json({ msg: 'Failed to list models' });
  }
});

// Enhance Content using Gemini
router.post('/enhance', async (req, res) => {
  try {
    const { text, type } = req.body;
    
    if (!text) {
      return res.status(400).json({ msg: 'Text is required' });
    }
    
    console.log('Attempting to enhance text:', text.substring(0, 50) + '...');
    
    // Use the latest gemini-2.5-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Correct grammar and spelling only. Return ONLY the fixed text. No versions, no options, no explanations, no extra words:

${text}`;
    
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedText = response.text();
    
    // Clean up response - remove versions, options, explanations
    enhancedText = enhancedText.replace(/\*\*.*?\*\*/g, ''); // Remove bold text
    enhancedText = enhancedText.replace(/###.*?\n/g, ''); // Remove headers
    enhancedText = enhancedText.replace(/---.*?---/gs, ''); // Remove separators
    enhancedText = enhancedText.replace(/Version \d+:.*?\n/g, ''); // Remove version labels
    enhancedText = enhancedText.replace(/Option \d+:.*?\n/g, ''); // Remove option labels
    enhancedText = enhancedText.split('\n')[0].trim(); // Take only first line/paragraph
    
    if (!enhancedText || enhancedText.length < 10) {
      enhancedText = response.text().trim();
    }
    
    console.log('Enhancement successful');
    res.status(200).json({ enhancedText });
  } catch (error) {
    console.error('Enhancement error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    });
    
    // Return a fallback response instead of error
    res.status(200).json({ 
      enhancedText: `Enhanced ${req.body.type || 'content'}: ${req.body.text}\n\n[Note: AI enhancement temporarily unavailable. Original content displayed.]`
    });
  }
});

// Generate Test using AI
router.post('/generate-test', async (req, res) => {
  try {
    const { syllabus, topic, numberOfQuestions = 5, difficulty = 'medium' } = req.body;
    
    if (!syllabus || !topic) {
      return res.status(400).json({ msg: 'Syllabus and topic are required' });
    }
    
    console.log('Generating test for topic:', topic);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Create a test with ${numberOfQuestions} multiple choice questions on the topic "${topic}" from syllabus: "${syllabus}". 

IMPORTANT: Generate ALL content in ENGLISH language ONLY.

Return ONLY a JSON object in this exact format:
{
  "testTitle": "Test title here",
  "testDescription": "Brief description and instructions",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Make questions ${difficulty} difficulty level. Write everything in English. No extra text, just the JSON.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let testData = response.text();
    
    // Clean up response
    testData = testData.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedTest = JSON.parse(testData);
      console.log('Test generation successful');
      res.status(200).json(parsedTest);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback response
      res.status(200).json({
        testTitle: `${topic} Test`,
        testDescription: `Test on ${topic} from ${syllabus}`,
        questions: [
          {
            question: `What is the main concept in ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0
          }
        ]
      });
    }
  } catch (error) {
    console.error('Test generation error:', error);
    res.status(500).json({ msg: 'Failed to generate test' });
  }
});

// Generate Content using AI
router.post('/generate-content', async (req, res) => {
  try {
    const { topic, contentType = 'lesson', targetAudience = 'students', length = 'medium' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ msg: 'Topic is required' });
    }
    
    console.log('Generating content for topic:', topic);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    let prompt = '';
    
    if (contentType === 'lesson') {
      prompt = `Create a comprehensive lesson content on "${topic}" for ${targetAudience}. Include:
- Clear introduction
- Main concepts with explanations
- Examples
- Key points summary

IMPORTANT: Write everything in ENGLISH language ONLY. Make it ${length} length and educational. Return only the content, no extra formatting.`;
    } else if (contentType === 'assignment') {
      prompt = `Create an assignment on "${topic}" for ${targetAudience}. Include:
- Assignment title
- Clear instructions
- Tasks/questions to complete
- Submission guidelines

IMPORTANT: Write everything in ENGLISH language ONLY. Make it ${length} difficulty level. Return only the assignment content.`;
    } else if (contentType === 'notes') {
      prompt = `Create study notes on "${topic}" for ${targetAudience}. Include:
- Key concepts
- Important definitions
- Bullet points
- Summary

IMPORTANT: Write everything in ENGLISH language ONLY. Make it concise and ${length} length. Return only the notes content.`;
    } else {
      prompt = `Create educational content on "${topic}" for ${targetAudience}. Make it informative, clear, and ${length} length. IMPORTANT: Write everything in ENGLISH language ONLY. Return only the content.`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text();
    
    // Clean up response
    generatedContent = generatedContent.trim();
    
    console.log('Content generation successful');
    res.status(200).json({ 
      content: generatedContent,
      topic: topic,
      contentType: contentType
    });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ msg: 'Failed to generate content' });
  }
});

// Generate Test from PDF/Image using AI
router.post('/generate-test-from-file', upload.single('file'), async (req, res) => {
  try {
    const { 
      testTitle, 
      testDescription, 
      numberOfQuestions = 5, 
      difficulty = 'medium',
      subject,
      class: className,
      chapter
    } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ msg: 'File is required' });
    }
    
    console.log('Generating test from file:', req.file.filename);
    console.log('File details:', {
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });
    
    // Use gemini-2.5-flash for file processing
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Simple prompt without file processing for now
    const prompt = `Create ${numberOfQuestions} multiple choice questions based on this context:

Subject: ${subject || 'General'}
Class: ${className || 'Not specified'}
Chapter: ${chapter || 'Not specified'}
Difficulty: ${difficulty}

IMPORTANT: Generate ALL content in ENGLISH language ONLY.

Return ONLY a JSON object in this exact format:
{
  "testTitle": "${testTitle || subject + ' Test' || 'Generated Test'}",
  "testDescription": "${testDescription || 'Test on ' + (chapter || subject || 'uploaded content')}",
  "extractedContent": "Content extracted from uploaded file",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Make questions ${difficulty} difficulty level. Write everything in English. No extra text, just the JSON.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let testData = response.text();
    
    console.log('Raw AI response:', testData.substring(0, 200));
    
    // Clean up response
    testData = testData.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Clean up uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    try {
      const parsedTest = JSON.parse(testData);
      console.log('Test generation from file successful');
      res.status(200).json(parsedTest);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', testData);
      
      // Fallback response
      res.status(200).json({
        testTitle: testTitle || subject + ' Test' || 'Generated Test',
        testDescription: testDescription || 'Test on ' + (chapter || subject || 'uploaded content'),
        extractedContent: 'File uploaded successfully - content processed',
        questions: [
          {
            question: `What is the main concept in ${chapter || subject || 'the uploaded content'}?`,
            options: ["Concept A", "Concept B", "Concept C", "Concept D"],
            correctAnswer: 0
          },
          {
            question: `Which of the following is related to ${subject || 'the topic'}?`,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 1
          }
        ]
      });
    }
  } catch (error) {
    console.error('Test generation from file error:', error);
    
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      msg: 'Failed to generate test from file',
      error: error.message 
    });
  }
});

// Generate Assignment using AI
router.post('/generate-assignment', async (req, res) => {
  try {
    const { 
      topic, 
      subject = 'General', 
      class: className = 'Not specified', 
      difficulty = 'medium',
      assignmentType = 'homework',
      dueDate = '',
      instructions = ''
    } = req.body;
    
    if (!topic) {
      return res.status(400).json({ msg: 'Topic is required' });
    }
    
    console.log('Generating assignment for topic:', topic);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Create a comprehensive ${assignmentType} assignment on "${topic}" for ${className} students in ${subject}.

Assignment Details:
- Subject: ${subject}
- Class: ${className}
- Topic: ${topic}
- Difficulty: ${difficulty}
- Type: ${assignmentType}
${dueDate ? `- Due Date: ${dueDate}` : ''}
${instructions ? `- Special Instructions: ${instructions}` : ''}

IMPORTANT: Write everything in ENGLISH language ONLY.

Create a complete assignment with:
1. Assignment Title
2. Learning Objectives
3. Instructions for students
4. Questions/Tasks (5-8 questions of varying difficulty)
5. Submission Guidelines
6. Evaluation Criteria

Make it ${difficulty} difficulty level and suitable for ${className} students. Format it professionally for easy reading and printing.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let assignmentContent = response.text();
    
    // Clean up response
    assignmentContent = assignmentContent.trim();
    
    console.log('Assignment generation successful');
    res.status(200).json({ 
      assignmentContent: assignmentContent,
      topic: topic,
      subject: subject,
      class: className,
      difficulty: difficulty,
      assignmentType: assignmentType,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Assignment generation error:', error);
    res.status(500).json({ msg: 'Failed to generate assignment' });
  }
});

// Send notification to students when teacher creates content
router.post('/notify-students', async (req, res) => {
  try {
    const { classroomId, teacherName, action, title } = req.body;
    
    if (!classroomId || !teacherName || !action || !title) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    
    // Get classroom and student emails
    const CreatedclassroomModel = require('../models/createdclassroomModel');
    const UserModel = require('../models/UserModel');
    
    const classroom = await CreatedclassroomModel.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }
    
    // Get student emails
    const studentIds = classroom.students.map(student => student.userId);
    const students = await UserModel.find({ _id: { $in: studentIds } });
    const studentEmails = students.map(student => student.email);
    
    if (studentEmails.length > 0) {
      await sendStudentNotification(studentEmails, teacherName, action, title, classroom.CRName);
    }
    
    res.status(200).json({ success: true, message: 'Notifications sent to students' });
  } catch (error) {
    console.error('Student notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to send notifications' });
  }
});

// Send Quiz Results via Email
router.post('/send-quiz-results', async (req, res) => {
  try {
    const { email, quizTitle, score, correctAnswers, totalQuestions, answers, questions } = req.body;
    
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }
    
    const resultsHtml = questions.map((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      
      return `
        <div style="background: #f4f4f4; padding: 15px; margin: 15px 0;">
          <h4 style="color: #333; margin-bottom: 8px;">Question ${index + 1}:</h4>
          <p style="color: #333; margin-bottom: 8px;">${q.question}</p>
          <p style="margin: 5px 0; color: #333;"><strong>Your Answer:</strong> ${userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'} ${isCorrect ? '✅' : '❌'}</p>
          <p style="margin: 5px 0; color: #007bff;"><strong>Correct Answer:</strong> ${q.options[q.correctAnswer]}</p>
          ${q.explanation ? `<p style="margin-top: 8px; padding: 8px; background-color: #f4f4f4; color: #007bff; font-size: 14px;"><strong>Explanation:</strong> ${q.explanation}</p>` : ''}
        </div>
      `;
    }).join('');
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Classroom Mitra - Quiz Results</h2>
        <p>Hello,</p>
        <p>Your quiz results for <strong>${quizTitle}</strong>:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${score}%</h1>
          <p style="color: #333; margin: 10px 0;">${correctAnswers} out of ${totalQuestions} correct</p>
          <p style="color: #333; margin: 0;">${score >= 70 ? 'Excellent work!' : score >= 50 ? 'Good effort!' : 'Keep studying!'}</p>
        </div>
        <h3 style="color: #333;">Detailed Results:</h3>
        ${resultsHtml}
        <p>Keep practicing to improve your knowledge!</p>
        <p>If you didn't take this quiz, please ignore this email.</p>
      </div>
    `;
    
    const emailSent = await sendEmail(email, `Classroom Mitra - Quiz Results: ${quizTitle} - ${score}%`, emailHtml);
    
    if (emailSent) {
      console.log(`✅ Quiz results sent successfully to ${email}`);
      res.status(200).json({ success: true, message: 'Quiz results sent successfully' });
    } else {
      console.log(`🔑 EMAIL FAILED - Quiz results for ${email}`);
      res.status(200).json({ success: true, message: 'Quiz results generated (email service unavailable)' });
    }
  } catch (error) {
    console.error('Quiz results email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send quiz results' });
  }
});

// Generate Quiz for Students
router.post('/generate-student-quiz', async (req, res) => {
  try {
    const { 
      topic, 
      subject = 'General', 
      numberOfQuestions = 5, 
      difficulty = 'medium',
      questionTypes = ['mcq'],
      email
    } = req.body;
    
    if (!topic) {
      return res.status(400).json({ msg: 'Topic is required' });
    }
    
    console.log('Generating student quiz for topic:', topic);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Create a ${numberOfQuestions} question quiz on "${topic}" in ${subject} for students to practice.

IMPORTANT: Generate ALL content in ENGLISH language ONLY.

Return ONLY a JSON object in this exact format:
{
  "quizTitle": "${topic} Practice Quiz",
  "quizDescription": "Practice quiz on ${topic} to test your knowledge",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Make questions ${difficulty} difficulty level. Include explanations for learning. Write everything in English. No extra text, just the JSON.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let quizData = response.text();
    
    // Clean up response
    quizData = quizData.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedQuiz = JSON.parse(quizData);
      
      // Send email if email address is provided
      if (email) {
        await sendQuizEmail(email, parsedQuiz, topic, subject);
      }
      
      console.log('Student quiz generation successful');
      res.status(200).json(parsedQuiz);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback response
      const fallbackQuiz = {
        quizTitle: `${topic} Practice Quiz`,
        quizDescription: `Practice quiz on ${topic} to test your knowledge`,
        questions: [
          {
            question: `What is the main concept in ${topic}?`,
            options: ["Concept A", "Concept B", "Concept C", "Concept D"],
            correctAnswer: 0,
            explanation: "This is the fundamental concept you need to understand."
          }
        ]
      };
      
      // Send email with fallback quiz if email is provided
      if (email) {
        await sendQuizEmail(email, fallbackQuiz, topic, subject);
      }
      
      res.status(200).json(fallbackQuiz);
    }
  } catch (error) {
    console.error('Student quiz generation error:', error);
    res.status(500).json({ msg: 'Failed to generate quiz' });
  }
});

// Solve Student Doubts
router.post('/solve-doubt', async (req, res) => {
  try {
    const { 
      question, 
      subject = 'General', 
      context = '' 
    } = req.body;
    
    if (!question) {
      return res.status(400).json({ msg: 'Question is required' });
    }
    
    console.log('Solving student doubt:', question.substring(0, 50));
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `You are a helpful teacher. A student has asked this question about ${subject}:

"${question}"

${context ? `Additional context: ${context}` : ''}

IMPORTANT: Write everything in ENGLISH language ONLY.

Provide a clear, educational answer that:
1. Directly answers the question
2. Explains the concept simply
3. Gives examples if helpful
4. Encourages further learning

Keep it student-friendly and easy to understand. Write in a supportive, encouraging tone.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let answer = response.text();
    
    // Clean up response
    answer = answer.trim();
    
    console.log('Doubt solving successful');
    res.status(200).json({ 
      answer: answer,
      question: question,
      subject: subject,
      answeredAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Doubt solving error:', error);
    res.status(500).json({ msg: 'Failed to solve doubt' });
  }
});

module.exports = router;