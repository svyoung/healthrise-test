const express = require('express');
const cors = require('cors');
const { taskInputValidator } = require('./middleware/validation');
const NotificationService = require('./services/NotificationService');

global.tasks = [];

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/tasks', taskInputValidator, (req, res) => {
  const newTask = req.body;
  newTask.id = Math.random();
  global.tasks.push(newTask);
  NotificationService.sendNotifications([{ channel: { send: msg => {} } }], 'Task created');
  res.json(newTask);
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
