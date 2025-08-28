const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  assigneeId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: String,
  dueDate: Date,
  status: String,
  comments: Array,
  metadata: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema);
