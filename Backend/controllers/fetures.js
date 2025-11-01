const CreatedclassroomModel = require("../models/createdclassroomModel");
const userModel = require("../models/UserModel");
const nodemailer = require('nodemailer');

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

// Send notification to students (same pattern as OTP)
const sendStudentNotification = async (email, teacherName, action, title, className) => {
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

  const emailSent = await sendEmail(email, `Classroom Mitra - New Activity in ${className}`, emailHtml);
  
  if (emailSent) {
    console.log(`✅ Notification sent successfully to ${email}`);
  } else {
    console.log(`🔑 EMAIL FAILED - Notification for ${email}`);
  }
};




async function post(req, res) {
  const { title, description, content, links, youtubeLink, scheduleTime, CRcode } = req.body;

  let fileData = null;
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    fileData = { 
      data: req.file.buffer.toString('base64'), 
      contentType: req.file.mimetype,
      originalName: req.file.originalname
    };
  }

  console.log('Received body:', req.body);
  console.log('Received file:', req.file);

  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });

    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    const newPost = {
      title,
      description,
      content,
      file: fileData,
      links,
      youtubeLink,
      scheduleTime,
    };

    classroom.posts.push(newPost);
    
    // Send notification
    const teacher = await userModel.findById(classroom.adminId);
    const notification = {
      message: `posted a new announcement: "${title}"`,
      type: 'post',
      teacherName: teacher ? teacher.name : 'Teacher',
      timestamp: new Date(),
      _id: new Date().getTime().toString()
    };
    
    if (!classroom.notifications) {
      classroom.notifications = [];
    }
    classroom.notifications.push(notification);
    
    await classroom.save();
    
    // Send email notifications to students
    console.log('🔍 Classroom students:', classroom.students);
    console.log('🔍 Student IDs to find:', classroom.students.map(s => s.userId));
    
    const students = await userModel.find({ 
      _id: { $in: classroom.students.map(s => s.userId) }
    });
    
    console.log('📧 Found students for email:', students.length);
    console.log('📧 Student emails:', students.map(s => s.email));
    
    for (const student of students) {
      console.log(`📤 Sending email to: ${student.email}`);
      await sendStudentNotification(
        student.email,
        teacher.name,
        'posted a new announcement',
        title,
        classroom.CRName
      );
    }

    return res.status(201).json({ msg: "Post created and added to classroom successfully" });

  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}





async function material(req, res) {
  const { title, description, links, scheduleTime, CRcode } = req.body;

  let fileData = null;
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    fileData = { 
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype,
      originalName: req.file.originalname 
    };
  } else {
    console.error("Uploaded material file is empty or missing. File details:", req.file);
    return res.status(400).json({ msg: "Uploaded file is empty or missing. Please upload a valid file." });
  }

  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });

    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    const newMaterial = {
      title,
      description,
      file: fileData, 
      links,
      scheduleTime,
    };

    classroom.materials.push(newMaterial);
    await classroom.save();

    return res.status(201).json({ msg: "Material added to classroom successfully" });
  } catch (error) {
    console.error("Error saving material:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}





async function assignment(req, res) {
  const { title, description, links, scheduleTime, CRcode } = req.body;

  let fileData = null;
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    fileData = { 
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype,
      originalName: req.file.originalname 
    };
  }

  console.log('Received body:', req.body);
  console.log('Received file:', req.file);

  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });

    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    const assignment = {
      title,
      description,
      file: fileData,
      links,
      scheduleTime,
    };

    classroom.aassignmets.push(assignment);
    
    // Send notification
    const teacher = await userModel.findById(classroom.adminId);
    const notification = {
      message: `assigned new work: "${title}"`,
      type: 'assignment',
      teacherName: teacher ? teacher.name : 'Teacher',
      timestamp: new Date(),
      _id: new Date().getTime().toString()
    };
    
    if (!classroom.notifications) {
      classroom.notifications = [];
    }
    classroom.notifications.push(notification);
    
    await classroom.save();
    
    // Send email notifications to students
    console.log('🔍 Assignment - Classroom students:', classroom.students);
    console.log('🔍 Assignment - Student IDs to find:', classroom.students.map(s => s.userId));
    
    const students = await userModel.find({ 
      _id: { $in: classroom.students.map(s => s.userId) }
    });
    
    console.log('📧 Assignment - Found students for email:', students.length);
    console.log('📧 Assignment - Student emails:', students.map(s => s.email));
    
    for (const student of students) {
      console.log(`📤 Assignment - Sending email to: ${student.email}`);
      await sendStudentNotification(
        student.email,
        teacher.name,
        'assigned new work',
        title,
        classroom.CRName
      );
    }

    return res.status(201).json({ msg: "Assignment posted and added to classroom successfully" });

  } catch (error) {
    console.error("Error saving assignment:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function testgenerater(req, res) {
  const { title, description, questions, scheduleTime, expireTime, CRcode } = req.body;

  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });

    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    const newTest = {
      title,
      description,
      questions,
      scheduleTime,
      expireTime
    };

    classroom.tests.push(newTest);
    
    // Send notification
    const teacher = await userModel.findById(classroom.adminId);
    const notification = {
      message: `created a new test: "${title}"`,
      type: 'test',
      teacherName: teacher ? teacher.name : 'Teacher',
      timestamp: new Date(),
      _id: new Date().getTime().toString()
    };
    
    if (!classroom.notifications) {
      classroom.notifications = [];
    }
    classroom.notifications.push(notification);
    
    await classroom.save();
    
    // Send email notifications to students
    console.log('🔍 Test - Classroom students:', classroom.students);
    console.log('🔍 Test - Student IDs to find:', classroom.students.map(s => s.userId));
    
    const students = await userModel.find({ 
      _id: { $in: classroom.students.map(s => s.userId) }
    });
    
    console.log('📧 Test - Found students for email:', students.length);
    console.log('📧 Test - Student emails:', students.map(s => s.email));
    
    for (const student of students) {
      console.log(`📤 Test - Sending email to: ${student.email}`);
      await sendStudentNotification(
        student.email,
        teacher.name,
        'created a new test',
        title,
        classroom.CRName
      );
    }

    return res.status(201).json({ msg: "Test created and added to classroom successfully" });

  } catch (error) {
    console.error("Error saving test:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}















async function addComment(req, res) {
  const { postId, comment, CRcode, userInfo } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const post = classroom.posts.find(p => p._id.toString() === postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    
    const newComment = {
      text: comment,
      author: userInfo,
      createdAt: new Date()
    };
    
    post.comments.push(newComment);
    await classroom.save();
    
    return res.status(201).json({ msg: "Comment added successfully", comment: newComment });
    
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function addAssignmentComment(req, res) {
  const { assignmentId, comment, CRcode, userInfo } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const assignmentItem = classroom.aassignmets.find(a => a._id.toString() === assignmentId);
    if (!assignmentItem) {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    
    const newComment = {
      text: comment,
      author: userInfo ,
      createdAt: new Date()
    };
    
    assignmentItem.comments.push(newComment);
    await classroom.save();
    
    return res.status(201).json({ msg: "Comment added successfully", comment: newComment });
    
  } catch (error) {
    console.error("Error adding assignment comment:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function addTestComment(req, res) {
  const { testId, comment, CRcode, userInfo } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const testItem = classroom.tests.find(t => t._id.toString() === testId);
    if (!testItem) {
      return res.status(404).json({ msg: "Test not found" });
    }
    
    const newComment = {
      text: comment,
      author: userInfo ,
      createdAt: new Date()
    };
    
    testItem.comments.push(newComment);
    await classroom.save();
    
    return res.status(201).json({ msg: "Comment added successfully", comment: newComment });
    
  } catch (error) {
    console.error("Error adding test comment:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function submitTestResult(req, res) {
  const { testId, studentName, studentEmail, studentId, answers, score, totalQuestions, CRcode } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const test = classroom.tests.find(t => t._id.toString() === testId);
    if (!test) {
      return res.status(404).json({ msg: "Test not found" });
    }
    
    const existingResult = test.results.find(r => r.studentId === studentId);
    if (existingResult && studentId !== 'anonymous') {
      return res.status(400).json({ msg: "You have already submitted this test" });
    }
    
    const newResult = {
      studnetname: studentName,
      studentemail: studentEmail,
      studentId: studentId,
      options: answers,
      numberofcorrect: score.toString(),
      cheatingpercetage: '0',
      createdAt: new Date()
    };
    
    test.results.push(newResult);
    await classroom.save();
    
    return res.status(201).json({ msg: "Test result submitted successfully", result: newResult });
    
  } catch (error) {
    console.error("Error submitting test result:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function getTestResults(req, res) {
  const { testId, CRcode } = req.params;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const test = classroom.tests.find(t => t._id.toString() === testId);
    if (!test) {
      return res.status(404).json({ msg: "Test not found" });
    }
    
    return res.status(200).json({ 
      testTitle: test.title,
      totalStudents: test.results.length,
      results: test.results 
    });
    
  } catch (error) {
    console.error("Error getting test results:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function submitAssignment(req, res) {
  const { assignmentId, studentId, studentName, text, CRcode } = req.body;
  
  let fileData = null;
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    fileData = {
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype,
      originalName: req.file.originalname
    };
  }
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const assignment = classroom.aassignmets.find(a => a._id.toString() === assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    
    // Check if student already submitted
    const existingSubmission = assignment.submissions.find(s => s.studentId === studentId);
    if (existingSubmission) {
      return res.status(400).json({ msg: "You have already submitted this assignment" });
    }
    
    const newSubmission = {
      studentId,
      studentName,
      file: fileData,
      text: text || '',
      submittedAt: new Date()
    };
    
    assignment.submissions.push(newSubmission);
    await classroom.save();
    
    return res.status(201).json({ msg: "Assignment submitted successfully", submission: newSubmission });
    
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function getAssignmentSubmissions(req, res) {
  const { assignmentId } = req.params;
  const { CRcode } = req.query;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const assignment = classroom.aassignmets.find(a => a._id.toString() === assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    
    return res.status(200).json({
      assignmentTitle: assignment.title,
      totalSubmissions: assignment.submissions.length,
      submissions: assignment.submissions
    });
    
  } catch (error) {
    console.error("Error getting assignment submissions:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function submitFeedback(req, res) {
  const { studentId, studentName, subject, message, rating, category, CRcode } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const newFeedback = {
      studentId,
      studentName,
      subject,
      message,
      rating: rating || null,
      category: category || 'general',
      status: 'pending',
      createdAt: new Date()
    };
    
    classroom.feedbacks.push(newFeedback);
    await classroom.save();
    
    return res.status(201).json({ msg: "Feedback submitted successfully", feedback: newFeedback });
    
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function getFeedbacks(req, res) {
  const { CRcode } = req.params;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    return res.status(200).json({
      classroomName: classroom.CRName,
      totalFeedbacks: classroom.feedbacks.length,
      feedbacks: classroom.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
    
  } catch (error) {
    console.error("Error getting feedbacks:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function updateFeedbackStatus(req, res) {
  const { feedbackId, status, CRcode } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const feedback = classroom.feedbacks.find(f => f._id.toString() === feedbackId);
    if (!feedback) {
      return res.status(404).json({ msg: "Feedback not found" });
    }
    
    feedback.status = status;
    await classroom.save();
    
    return res.status(200).json({ msg: "Feedback status updated successfully", feedback });
    
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function saveAttendance(req, res) {
  console.log('🚀 saveAttendance function called!');
  
  const { date, attendanceData, CRcode } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    // Process attendance data to ensure proper status handling
    const processedAttendanceData = attendanceData.map(student => ({
      studentId: student.studentId,
      studnetsrollnumber: student.studnetsrollnumber,
      studentName: student.studentName,
      status: student.status || 'absent' // Default to absent if no status provided
    }));
    
    const existingAttendance = classroom.attendences.find(a => a.date === date);
    
    if (existingAttendance) {
      existingAttendance.attendencelist = processedAttendanceData;
    } else {
      const newAttendance = {
        date: date,
        attendencelist: processedAttendanceData
      };
      classroom.attendences.push(newAttendance);
    }
    
    await classroom.save();
    
    return res.status(200).json({ msg: "Attendance saved successfully" });
    
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}


async function getAttendance(req, res) {
  const { date, CRcode } = req.query;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    const attendance = classroom.attendences.find(a => a.date === date);
    
    if (!attendance) {
      return res.status(200).json({ attendance: null, msg: "No attendance found for this date" });
    }
    
    return res.status(200).json({ attendance: attendance.attendencelist });
    
  } catch (error) {
    console.error("Error getting attendance:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
  post,
  assignment,
  testgenerater,
  material,
  addComment,
  addAssignmentComment,
  addTestComment,
  submitTestResult,
  getTestResults,
  submitAssignment,
  getAssignmentSubmissions,
  submitFeedback,
  getFeedbacks,
  updateFeedbackStatus,
  saveAttendance,
  getAttendance
};