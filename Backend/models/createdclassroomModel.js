const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String
    },
    file: { // Updated to handle Base64-encoded file data
        data: String, // Base64-encoded data
        contentType: String, // MIME type
        originalName: String // Original file name
    },
    links: [{
        type: String
    }],
    youtubeLink: {
        type: String
    },
    scheduleTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        text: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});



const assignment = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    file: { // Updated to handle Base64-encoded file data
        data: String, // Base64-encoded data
        contentType: String, // MIME type
        originalName: String // Original file name
    },
    links: [{
        type: String
    }],
    scheduleTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        text: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    submissions: [{
        studentId: {
            type: String,
            required: true
        },
        studentName: {
            type: String,
            required: true
        },
        file: {
            data: String,
            contentType: String,
            originalName: String
        },
        text: {
            type: String
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }]
});



const question = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    questiontitle: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'multiple_choice',
            'checkboxes',
            'dropdown',
            'file_upload',
            'linear_scale',
            'rating',
            'date',
            'time'
        ]
    },
    options: {
        type: [String],
        default: []
    },
    answer: String,
    file: { // Optional file for file upload questions
        data: String,
        contentType: String,
        originalName: String
    },
    scale: { // For linear scale or rating questions
        min: Number, // Minimum value
        max: Number  // Maximum value
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const result = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    studnetname: {
        type: String,
        required: true
    },
    studentemail: {
        type: String
    },
    studentId: {
        type: String,
        required: false
    },
    options: {
        type: [String]
    },
    numberofcorrect: String,
    cheatingpercetage: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const test = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    questions: [question],
    results: [result],
    scheduleTime: {
        type: Date
    },
    expireTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        text: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})


const classerecoding = new Schema({
    recoededvideo:String,
    studentsutend:{
        emailid:{
            type:String,
            required:true
        },
        timewatch:{
           type:String,
            required:true
        },
        massages:{
             type:String,
            required:true
        },
        poleanswers:{
             type:String,
            required:true
        }

    },
    title:String,
    description:String,
    liveclassjoincode:String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const material = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    file: { // Updated to handle Base64-encoded file data
        data: String, // Base64-encoded data
        contentType: String, // MIME type
        originalName: String // Original file name
    },
    links: [{
        type: String
    }],
    scheduleTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const feedback = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    category: {
        type: String,
        enum: ['general', 'technical', 'content', 'suggestion', 'complaint'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});





const attendence = new Schema({
    uniqueId: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },

    

    date: {
        type: String,
        required: true
    },
    attendencelist: [{
        studentId: {
            type: String,
            required: true
        },
        studnetsrollnumber: {
            type: String
        },
        studentName: {
            type: String,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'not-in-class'],
            default: 'absent'
        }
    }]
});


const CreatedclassroomSchema = new mongoose.Schema({
    adminname: {
        type: String,
        required: true,
        minlength: [3, 'name must be at least 3 characters long'],
    },
    CRcode: {
        type: String,
        required: true,
        unique: true,
    },
    CRName: {
        type: String,
        required: true,
        minlength: [3, 'name must be at least 3 characters long'],
    },
    CRDescription: {
        type: String,
        required: true,
        minlength: [3, 'name must be at least 3 characters long'],
    },
    CRsubject: {
        type: String,
        required: true,
        minlength: [3, 'name must be at least 3 characters long'],
    },
    adminId: {
        type: String,
        required: true,
    },
    students:[{
        studentId: {
            type: String
        },
        studentName: {
            type: String
        },
        userId: {
            type: String
        },
        studnetsrollnumber: {
            type: String
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    posts: [PostSchema],
    aassignmets: [assignment],
    tests: [test],
    materials: [material],
    classerecodings:[classerecoding],
    feedbacks: [feedback],
    attendences:[attendence],
    notifications: [{
        message: String,
        type: String,
        teacherName: String,
        timestamp: { type: Date, default: Date.now },
        _id: String
    }]

}, { timestamps: true });

const CreatedclassroomModel = mongoose.model('CreatedclassroomSchema', CreatedclassroomSchema);
module.exports = CreatedclassroomModel;
