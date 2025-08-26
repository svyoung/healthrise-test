const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  assigneeId: String,
  dueDate: String,
  status: String,
  comments: Array,
  metadata: Object
});

module.exports = mongoose.model('Task', TaskSchema);
