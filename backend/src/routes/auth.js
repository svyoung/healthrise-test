const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const mockUser = {
  id: 1,
  username: 'admin',
  passwordHash: '$2a$12$nhtEKPzyI0FVVNgSyDdfxu5TjZJDxIHOSTQNzLp5wNTQ3RCQD88LC', // password123
  role: 'admin'
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  const validPassword = await bcrypt.compare(password, mockUser.passwordHash);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const userPayload = { id: mockUser.id, username: mockUser.username, role: mockUser.role };
  const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

  global.historyLog.push({
    id: Math.random(),
    userId: req.body.userId || 'unknown',
    action: 'User login',
    taskId: null,
    timestamp: new Date().toISOString(),
    details: null
  })

  res.json({ token });
});

module.exports = router;
