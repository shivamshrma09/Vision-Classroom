const userModel = require("../models/UserModel");
const CreatedclassroomModel = require("../models/createdclassroomModel");

const { nanoid } = require('nanoid');

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




const generateStudentId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};












async function joinclassroom(req, res) {
  console.log('Join classroom request:', req.body);
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

    const studentId = generateStudentId();
    const updatedUser = await userModel.findByIdAndUpdate(
      adminId, 
      { $push: { classroomcodes: classroom._id } }, 
      { new: true }
    );

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
    
    const user = await userModel.findById(userid);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const allClassroomIds = user.classroomcodes || [];
    
    const allClassrooms = await CreatedclassroomModel.find({
      _id: { $in: allClassroomIds }
    });
    
    const classroomsWithData = await Promise.all(
      allClassrooms.map(async (classroom) => {
        const isAdmin = classroom.adminId.toString() === userid.toString();
        
     
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
    const assignments = classroom.aassignmets || []; 
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








async function getclassrooms(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded._id;
    
    const user = await userModel.findById(userid);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const allClassroomIds = user.classroomcodes || [];
    
    const allClassrooms = await CreatedclassroomModel.find({
      _id: { $in: allClassroomIds }
    });
    
    return res.status(200).json({
      classrooms: allClassrooms
    });
    
  } catch (error) {
    console.error('Get classrooms error:', error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function leaveclassroom(req, res) {
  try {
    const { classroomId, userId } = req.body;
    
    if (!classroomId || !userId) {
      return res.status(400).json({ message: "Classroom ID and User ID required" });
    }
    
    // Remove user from classroom students array
    const classroom = await CreatedclassroomModel.findByIdAndUpdate(
      classroomId,
      { $pull: { students: { userId: userId } } },
      { new: true }
    );
    
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    
    // Remove classroom from user's classroomcodes array
    await userModel.findByIdAndUpdate(
      userId,
      { $pull: { classroomcodes: classroomId } },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      message: "Left classroom successfully"
    });
    
  } catch (error) {
    console.error('Leave classroom error:', error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports={
    creatclassroom,
    joinclassroom,
    getclassroomdata,
    getclassroomdataenter,
    getclassrooms,
    leaveclassroom
}



