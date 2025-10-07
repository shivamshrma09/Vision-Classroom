const userModel = require("../models/userModel");
const CreatedclassroomModel = require("../models/createdclassroomModel");

const { nanoid } = require('nanoid');

//delet it when frontend ready
const generateUniqueClassroomCode = () => {
  return nanoid(7); 
};



async function creatclassroom(req, res) {
  const { adminname, adminId, CRName, CRDescription, CRsubject } = req.body;

      const CRcode1 = generateUniqueClassroomCode();
if(!adminname || !adminId ||!CRName ){
  res.send("plz fill all the field")
}
  
  const Newclassroom = await CreatedclassroomModel.create({
    adminname,
    adminId,
    CRName,
    CRDescription,
    CRsubject,
    CRcode:CRcode1,
  });

      const updatedUser = await userModel.findByIdAndUpdate(
      adminId, 
      { $push: { classroomcodes: Newclassroom._id } }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ mas: "User not found" });
    }

    return res.status(201).json({ mas: "Classroom created successfully" })


}




// Function to generate random student ID
const generateStudentId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};












async function joinclassroom(req, res) {
  const { CRcode, adminId  , userollnumber} = req.body;

  if (!CRcode || !adminId || !userollnumber) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }

  try {
    const classroom = await CreatedclassroomModel.findOne({ CRcode: CRcode });
    
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    const user = await userModel.findById(adminId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const existingStudent = classroom.students.find(student => student.userId === adminId);
    
    if (existingStudent) {
      return res.status(400).json({ msg: "Already joined this classroom" });
    }

    // Generate unique student ID
    const studentId = generateStudentId();

    // Add classroom to user's classroom codes
    const updatedUser = await userModel.findByIdAndUpdate(
      adminId, 
      { $push: { classroomcodes: classroom._id } }, 
      { new: true }
    );

    // Add student to classroom with generated ID and name from database
    const addStudent = await CreatedclassroomModel.findOneAndUpdate(
      { CRcode: CRcode },
      { 
        $push: { 
          students: {
            studentId: studentId,
            studentName: user.name,
            userId: adminId,
            studnetsrollnumber: userollnumber,
            joinedAt: new Date()
          }
        }
      },
      { new: true }
    );

    return res.status(201).json({ 
      msg: "Classroom joined successfully",
      studentId: studentId,
      studentName: user.name

    
    });

  } catch (error) {
    console.error('Join classroom error:', error);
    return res.status(500).json({ msg: "Server error" });
  }
}




async function getclassroomdata(req, res) {
  try {
    const { userid } = req.body;
    
    if (!userid) {
      return res.status(400).json({ message: "User ID required" });
    }
    
    // Find user to get classroom IDs
    const user = await userModel.findById(userid);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get all classroom IDs from user
    const allClassroomIds = user.classroomcodes || [];
    
    // Fetch all classrooms in one query
    const allClassrooms = await CreatedclassroomModel.find({
      _id: { $in: allClassroomIds }
    });
    
    // For each classroom, fetch related data
    const classroomsWithData = await Promise.all(
      allClassrooms.map(async (classroom) => {
        const isAdmin = classroom.adminId.toString() === userid.toString();
        
        // You'll need to create these models/collections
        // const posts = await PostModel.find({ classroomId: classroom._id });
        // const assignments = await AssignmentModel.find({ classroomId: classroom._id });
        // const tests = await TestModel.find({ classroomId: classroom._id });
        
        // For now, using mock data - replace with actual queries
        const posts = [];
        const assignments = [];
        const tests = [];
        
        return {
          ...classroom.toObject(),
          type: isAdmin ? 'created' : 'joined',
          role: isAdmin ? 'admin' : 'student',
          posts: posts,
          assignments: assignments,
          tests: tests,
          stats: {
            totalPosts: posts.length,
            totalAssignments: assignments.length,
            totalTests: tests.length,
            totalStudents: classroom.students?.length || 0
          }
        };
      })
    );
    
    return res.status(200).json({
      classrooms: classroomsWithData,
      totalClassrooms: classroomsWithData.length
    });
    
  } catch (error) {
    console.error('Get classrooms error:', error);
    return res.status(500).json({ message: "Server error" });
  }
}







async function getclassroomdataenter(req, res) {
  try {
    const { classroomid } = req.body;
    
    if (!classroomid) {
      return res.status(400).json({ message: "Classroom ID required" });
    }

    const classroom = await CreatedclassroomModel.findById(classroomid);
      
    if (!classroom) {
      return res.status(404).json({ msg: "Classroom not found" });
    }

    const posts = classroom.posts || [];
    const assignments = classroom.aassignmets || []; // Note: typo in model 'aassignmets'
    const tests = classroom.tests || [];
    const materials = classroom.materials || [];
    
    return res.status(200).json({
      classroom: {
        ...classroom.toObject(),
        posts,
        assignments,
        tests,
        materials
      }
    });
    
  } catch (error) {
    console.error('Get classroom data error:', error);
    return res.status(500).json({ message: "Server error" });
  }
}








module.exports={
    creatclassroom,
    joinclassroom,
    getclassroomdata,
    getclassroomdataenter
}



