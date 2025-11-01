const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    default: ""
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});

const TodoModel = mongoose.model("Todo", todoSchema);

module.exports = TodoModel;