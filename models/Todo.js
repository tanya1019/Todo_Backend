const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const todoSchema = new Schema({
  todo: String,
  created_at: String,
  completed: Boolean,
  userId: String,
  priority: Number,
  deadline: String,
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
