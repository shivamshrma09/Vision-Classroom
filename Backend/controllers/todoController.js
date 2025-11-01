const TodoModel = require('../models/TodoModel');

// Get todos for a specific date
const getTodos = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;
    
    const todos = await TodoModel.find({ 
      userId, 
      date: date || new Date().toISOString().split('T')[0] 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, todos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    console.log('Creating todo with data:', req.body);
    console.log('User:', req.user);
    
    const { text, time, date } = req.body;
    const userId = req.user._id;
    
    const todo = new TodoModel({
      text,
      time: time || "",
      date: date || new Date().toISOString().split('T')[0],
      userId
    });
    
    await todo.save();
    console.log('Todo saved successfully:', todo);
    res.status(201).json({ success: true, todo });
  } catch (error) {
    console.error('Todo creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update todo (toggle completion or edit)
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;
    
    const todo = await TodoModel.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );
    
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    
    res.status(200).json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const todo = await TodoModel.findOneAndDelete({ _id: id, userId });
    
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    
    res.status(200).json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};