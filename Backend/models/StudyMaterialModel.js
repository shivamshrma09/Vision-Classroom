const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileData: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  classroomId: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['notes', 'assignment', 'reference', 'video', 'other'],
    default: 'other'
  }
});

const StudyMaterialModel = mongoose.model("StudyMaterial", studyMaterialSchema);

module.exports = StudyMaterialModel;