const CreatedclassroomModel = require("../models/createdclassroomModel");
const userModel = require("../models/userModel");



//Post generater
async function post(req, res) {
  const { title, description, content, links, youtubeLink, scheduleTime, CRcode } = req.body;

  let fileData = null;
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    fileData = { 
      data: req.file.buffer.toString('base64'), // Convert file buffer to Base64
      contentType: req.file.mimetype, // Store MIME type
      originalName: req.file.originalname // Store original file name
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
      file: fileData, // Save Base64-encoded file data
      links,
      youtubeLink,
      scheduleTime,
    };

    classroom.posts.push(newPost);
    await classroom.save();

    return res.status(201).json({ msg: "Post created and added to classroom successfully" });

  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}




//material generater
async function material(req, res) {
  const { title, description, links, scheduleTime, CRcode } = req.body;

  let fileData = null;
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    fileData = { 
      data: req.file.buffer.toString('base64'), // Convert file buffer to Base64
      contentType: req.file.mimetype, // Store MIME type
      originalName: req.file.originalname // Store original file name
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
      file: fileData, // Save Base64-encoded file data
      links,
      scheduleTime,
    };

    classroom.materials.push(newMaterial); // Push the material to the `materials` array
    await classroom.save();

    return res.status(201).json({ msg: "Material added to classroom successfully" });
  } catch (error) {
    console.error("Error saving material:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}




//assignmet poster
async function assignment(req, res) {
  const { title, description, links, scheduleTime, CRcode } = req.body; // Removed `content` since it's not provided in the request body

  let fileData = null;
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    fileData = { 
      data: req.file.buffer.toString('base64'), // Convert file buffer to Base64
      contentType: req.file.mimetype, // Store MIME type
      originalName: req.file.originalname // Store original file name
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
      file: fileData, // Save Base64-encoded file data
      links,
      scheduleTime,
    };

    classroom.aassignmets.push(assignment); // Push the assignment to the `aassignmets` array
    await classroom.save();

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

    // Validate and format the questions array
    const formattedQuestions = questions.map((q, index) => {
      if (!q.type || !['multiple_choice', 'checkboxes', 'dropdown', 'file_upload', 'linear_scale', 'rating', 'date', 'time'].includes(q.type)) {
        console.warn(`Invalid or missing question type for question at index ${index + 1}: ${q.questiontitle}`);
        q.type = 'multiple_choice'; // Default to 'multiple_choice' if type is missing or invalid
      }

      const question = {
        questiontitle: q.questiontitle,
        type: q.type,
        options: q.options || [], // Default to an empty array if options are not provided
        answer: q.answer || null, // Default to null if no answer is provided
        scale: q.scale || null // Default to null if no scale is provided
      };

      // Handle file upload for file_upload type questions
      if (q.type === 'file_upload' && q.file) {
        question.file = {
          data: q.file.data,
          contentType: q.file.contentType,
          originalName: q.file.originalName
        };
      }

      return question;
    });

    // Create the test object
    const newTest = {
      title,
      description,
      questions: formattedQuestions,
      scheduleTime,
      expireTime
    };

    // Add the test to the classroom
    classroom.tests.push(newTest);
    await classroom.save();

    return res.status(201).json({ msg: "Test created and added to classroom successfully" });
  } catch (error) {
    console.error("Error creating test:", error);
    return res.status(400).json({ msg: error.message });
  }
}














//comment poster
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

//assignment comment poster
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

//test comment poster
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

//test result submission
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
    
    // Check if student has already submitted
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

//get test results for teacher
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

//assignment submission
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

//get assignment submissions
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

//submit feedback
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

//get all feedbacks (for teachers)
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

//update feedback status (for teachers)
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

//save attendance
async function saveAttendance(req, res) {
  const { date, attendanceData, CRcode } = req.body;
  
  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }
    
    // Check if attendance for this date already exists
    const existingAttendance = classroom.attendences.find(a => a.date === date);
    
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.attendencelist = attendanceData;
    } else {
      // Create new attendance record
      const newAttendance = {
        date: date,
        attendencelist: attendanceData
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

//get attendance for specific date
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