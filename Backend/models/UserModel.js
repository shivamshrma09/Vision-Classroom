const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    required: true,
    select: false,
  },
  strem: {
    required: true,
    type: String,
  },
 

  classroomcodes:{
    type: [String],
    default: [],    
  },

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
