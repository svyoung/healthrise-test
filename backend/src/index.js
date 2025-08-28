import express from 'express'
import cors from 'cors'
import fs from 'fs'
import bodyParser from 'body-parser'
import csv from 'csv-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import mockActivities from './mockActivities.js'

global.tasks = []
global.historyLog = []

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tasksCsvPath = path.join(__dirname, './tasks.csv')

fs.createReadStream(tasksCsvPath)
  .pipe(csv())
  .on('data', (row) => {
    global.tasks.push({
      id: row.id,
      title: row.title,
      assigneeId: row.assigneeId || 'unassigned',
      dueDate: row.dueDate || new Date().toISOString(),
      comments: row.comments || '',
      status: row.status,
      metadata: row.metadata,
      createdAt: row.createdAt || '',
      updatedAt: row.updatedAt || ''
    })
  })
  .on('end', () => {
    console.log(`Loaded ${global.tasks.length} tasks from CSV`)
  })

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

// auth routes
app.use('/auth', authRoutes)

// task routes
app.use('/api/tasks', taskRoutes)

// get all logs
app.get('/api/logs', (_, res) => {
  global.historylog = mockActivities
  res.json(global.historyLog.length ? global.historyLog : mockActivities)
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})
