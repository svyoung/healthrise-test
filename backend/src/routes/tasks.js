import express from 'express'
import { taskInputValidator } from '../middleware/validation.js'
import NotificationService from '../services/NotificationService.js'

const router = express.Router()

// get all tasks
router.get('/', (req, res) => {
    res.json(global.tasks)
})

// add task
router.post('/', taskInputValidator, (req, res) => {
    const newTask = req.body
    newTask.id = Math.random() // could use uuid() instead for better uniqueness and less collisions
    global.tasks.push(newTask)
  
    global.historyLog.push({
      id: Math.random(),
      userId: req.body.userId || 'unknown',
      action: 'Add Task',
      taskId: newTask.id,
      timestamp: new Date().toISOString(),
      details: { title: newTask.title, assigneeId: newTask.assigneeId }
    })
  
    NotificationService.sendNotifications([{ channel: { send: msg => {} } }], 'Task created')
    res.json(newTask)
})

// edit task
router.put('/:id', taskInputValidator, (req, res) => {
    const { id } = req.params
    const taskIndex = global.tasks.findIndex(t => String(t.id) === String(id))
  
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
  
    global.tasks[taskIndex] = {
      ...global.tasks[taskIndex],
      ...req.body,
      id
    }
  
    global.historyLog.push({
      id: Math.random(),
      userId: req.body.userId || 'unknown',
      action: 'Edit Task',
      taskId: id,
      timestamp: new Date().toISOString(),
      details: { updatedFields: req.body }
    })
  
    NotificationService.sendNotifications([{ channel: { send: msg => {} } }], `Task ${id} updated`)
    res.json(global.tasks[taskIndex])
})

// delete task
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const taskIndex = global.tasks.findIndex(t => String(t.id) === String(id))
  
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    const deletedTask = global.tasks.splice(taskIndex, 1)[0]
  
    global.historyLog.push({
      id: Math.random(),
      userId: req.body.userId || 'unknown',
      action: 'Delete Task',
      taskId: deletedTask.id,
      timestamp: new Date().toISOString(),
      details: { title: deletedTask.title }
    })
  
    NotificationService.sendNotifications([{ channel: { send: msg => {} } }], `Task ${id} deleted`)
    res.json(deletedTask)
})

export default router