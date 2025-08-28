import express from 'express';
import request from 'supertest';
import tasksRouter from '../routes/tasks.js';
import NotificationService from '../services/NotificationService.js';

jest.mock('../services/NotificationService.js', () => ({
  sendNotifications: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRouter);

beforeEach(() => {
  global.tasks = [];
  global.historyLog = [];
  NotificationService.sendNotifications.mockClear();
});

describe('Tasks API', () => {

  it('should return empty array initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new task', async () => {
    const newTask = { id: 29384747, title: 'Test Task', dueDate: new Date().toISOString(), assigneeId: 'user1', status: 'todo', comments: 'Test' };

    const res = await request(app)
      .post('/api/tasks')
      .send(newTask);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Task');
    expect(global.tasks.length).toBe(1);
    expect(global.historyLog.length).toBe(1);
    expect(NotificationService.sendNotifications).toHaveBeenCalled();
  });

  it('should edit an existing task', async () => {
    global.tasks.push({ id: '123', title: 'Old Task', assigneeId: 'user1', status: 'todo', comments: '' });

    const res = await request(app)
        .put('/api/tasks/123')
        .send({ 
            title: 'Updated Task', 
            assigneeId: 'user1', 
            dueDate: new Date().toISOString(), 
            status: 'done',
            comments: 'Updated comment'
        });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(global.historyLog[0].action).toBe('Edit Task');
  });

  it('should return 404 for editing non-existent task', async () => {
    const res = await request(app)
      .put('/api/tasks/9324829348023')
      .send({ 
        title: 'Updated Task', 
        assigneeId: 'user1', 
        dueDate: new Date().toISOString(), 
        status: 'done',
        comments: 'Updated comment'
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });

  it('should delete a task', async () => {
    global.tasks.push({ id: 'abc', title: 'Delete Me', assigneeId: 'user1', status: 'todo', comments: '' });

    const res = await request(app).delete('/api/tasks/abc');

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Delete Me');
    expect(global.tasks.length).toBe(0);
    expect(global.historyLog[0].action).toBe('Delete Task');
  });

  it('should return 404 for deleting non-existent task', async () => {
    const res = await request(app).delete('/api/tasks/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });

});
