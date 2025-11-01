const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "name must be at least 3 characters long"],
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    required: true,
    type: String,
  },
  password: {
    type: String,
    required: function() {
      return !this.authProvider; // Password not required for OAuth users
    },
    select: false,
  },
  strem: {
    required: function() {
      return !this.authProvider; // Stream not required for OAuth users
    },
    type: String,
  },
  authProvider: {
    type: String,
    enum: ['google', 'linkedin', null],
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  profilePhoto: {
    data: String,
    contentType: String,
    originalName: String
  },
 

  classroomcodes:{
    type: [String],
    default: [],    
  },
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    privateComments: { type: Boolean, default: true },
    classEnrollments: { type: Boolean, default: true },
    workAndPosts: { type: Boolean, default: true },
    returnedWork: { type: Boolean, default: true },
    invitations: { type: Boolean, default: true },
    dueDateReminders: { type: Boolean, default: true }
  }

  });



userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
