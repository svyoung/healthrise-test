const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);