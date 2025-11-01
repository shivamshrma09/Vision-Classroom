const StudyMaterialModel = require('../models/StudyMaterialModel');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Helper function to notify students
const notifyStudents = async (classroomId, teacherName, action, title) => {
  try {
    await axios.post(`${process.env.BACKEND_URL || 'http://localhost:4000'}/gemini/notify-students`, {
      classroomId,
      teacherName,
      action,
      title
    });
  } catch (error) {
    console.error('Failed to send notifications:', error);
  }
};

// Upload study material
async function uploadStudyMaterial(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, description, classroomId, category, fileName, fileType, fileData, fileSize } = req.body;
    
    if (!fileData) {
      return res.status(400).json({ message: "No file data provided" });
    }
    
    const studyMaterial = await StudyMaterialModel.create({
      title,
      description,
      fileName,
      fileType,
      fileData,
      fileSize,
      classroomId,
      uploadedBy: decoded._id,
      category: category || 'other'
    });
    
    // Get user info for notification
    const UserModel = require('../models/UserModel');
    const user = await UserModel.findById(decoded._id);
    
    // Send notification to students if it's a classroom material
    if (classroomId && classroomId !== 'general-storage' && classroomId !== 'user-storage' && user) {
      await notifyStudents(classroomId, user.name, 'uploaded study material', title);
    }
    
    return res.status(201).json({
      success: true,
      message: "Study material uploaded successfully",
      data: studyMaterial
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: "Failed to upload study material" });
  }
}

// Get study materials for a classroom
async function getStudyMaterials(req, res) {
  try {
    const { classroomId } = req.params;
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    let materials;
    
    if (classroomId === 'general-storage') {
      // For general storage, get materials uploaded by the current user
      if (!token) {
        return res.status(401).json({ message: "Token required" });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      materials = await StudyMaterialModel.find({ 
        classroomId: 'general-storage',
        uploadedBy: decoded._id 
      })
        .populate('uploadedBy', 'name email')
        .sort({ uploadedAt: -1 });
    } else {
      // For specific classroom, get all materials
      materials = await StudyMaterialModel.find({ classroomId })
        .populate('uploadedBy', 'name email')
        .sort({ uploadedAt: -1 });
    }
    
    return res.status(200).json({
      success: true,
      data: materials
    });
    
  } catch (error) {
    console.error('Get materials error:', error);
    return res.status(500).json({ message: "Failed to fetch study materials" });
  }
}

// Download study material
async function downloadStudyMaterial(req, res) {
  try {
    const { materialId } = req.params;
    
    const material = await StudyMaterialModel.findById(materialId);
    
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        fileName: material.fileName,
        fileType: material.fileType,
        fileData: material.fileData
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ message: "Failed to download file" });
  }
}

// Delete study material
async function deleteStudyMaterial(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    const { materialId } = req.params;
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const material = await StudyMaterialModel.findById(materialId);
    
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    // Check if user is the uploader
    if (material.uploadedBy.toString() !== decoded._id) {
      return res.status(403).json({ message: "Not authorized to delete this material" });
    }
    
    // Delete from database
    await StudyMaterialModel.findByIdAndDelete(materialId);
    
    return res.status(200).json({
      success: true,
      message: "Study material deleted successfully"
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ message: "Failed to delete study material" });
  }
}

// Upload user study material (no classroom)
async function uploadUserStudyMaterial(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, description, category, fileName, fileType, fileData, fileSize } = req.body;
    
    if (!fileData) {
      return res.status(400).json({ message: "No file data provided" });
    }
    
    const studyMaterial = await StudyMaterialModel.create({
      title,
      description,
      fileName,
      fileType,
      fileData,
      fileSize,
      classroomId: 'user-storage',
      uploadedBy: decoded._id,
      category: category || 'other'
    });
    
    return res.status(201).json({
      success: true,
      message: "Study material uploaded successfully",
      data: studyMaterial
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: "Failed to upload study material" });
  }
}

// Get user study materials
async function getUserStudyMaterials(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const materials = await StudyMaterialModel.find({ 
      uploadedBy: decoded._id,
      classroomId: 'user-storage'
    })
      .populate('uploadedBy', 'name email')
      .sort({ uploadedAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: materials
    });
    
  } catch (error) {
    console.error('Get materials error:', error);
    return res.status(500).json({ message: "Failed to fetch study materials" });
  }
}

module.exports = {
  uploadStudyMaterial,
  uploadUserStudyMaterial,
  getStudyMaterials,
  getUserStudyMaterials,
  downloadStudyMaterial,
  deleteStudyMaterial
};