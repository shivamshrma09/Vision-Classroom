const express = require('express');
const { body } = require("express-validator")
const router = express.Router();
const creatclassroom = require('../controllers/creatclassroom')


router.post("/creat-classroom" , creatclassroom.creatclassroom)
router.post("/join-classroom" , creatclassroom.joinclassroom)
router.post("/classroom-data" , creatclassroom.getclassroomdata)
router.post("/classroomspecific-data" , creatclassroom.getclassroomdataenter)


module.exports = router;
