const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to get io instance
const getIo = (req) => {
  return req.app.get('io');
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Get all tasks for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;
    
    const where = {
      assigneeId: req.user.userId
    };
    
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: { id: true, title: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { 
        id: req.params.id,
        assigneeId: req.user.userId 
      },
      include: {
        project: {
          select: { id: true, title: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, projectId, priority = 'medium', dueDate } = req.body;
    
    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and projectId are required' });
    }
    
    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        ownerId: req.user.userId 
      }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: req.user.userId
      },
      include: {
        project: {
          select: { id: true, title: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    // Emit WebSocket event
    const io = getIo(req);
    if (io) {
      io.to(`project-${projectId}`).emit('task-created', task);
      io.to(`user-${req.user.userId}`).emit('task-created', task);
    }
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = await prisma.task.findFirst({
      where: { 
        id: req.params.id,
        assigneeId: req.user.userId 
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      },
      include: {
        project: {
          select: { id: true, title: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    // Emit WebSocket event
    const io = getIo(req);
    if (io) {
      io.to(`project-${updatedTask.project.id}`).emit('task-updated', updatedTask);
      io.to(`user-${updatedTask.assigneeId}`).emit('task-updated', updatedTask);
    }
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { 
        id: req.params.id,
        assigneeId: req.user.userId 
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await prisma.task.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
