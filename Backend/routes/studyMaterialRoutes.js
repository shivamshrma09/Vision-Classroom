const express = require('express');
const router = express.Router();
const {
  uploadStudyMaterial,
  uploadUserStudyMaterial,
  getStudyMaterials,
  getUserStudyMaterials,
  downloadStudyMaterial,
  deleteStudyMaterial
} = require('../controllers/studyMaterialController');

// Upload study material
router.post('/upload', uploadStudyMaterial);
router.post('/upload-user', uploadUserStudyMaterial);

// Get study materials for a classroom
router.get('/classroom/:classroomId', getStudyMaterials);
router.get('/user', getUserStudyMaterials);

// Download study material
router.get('/download/:materialId', downloadStudyMaterial);

// Delete study material
router.delete('/:materialId', deleteStudyMaterial);

module.exports = router;