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

// Get all projects for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.userId },
      include: {
        tasks: true,
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        ownerId: req.user.userId 
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, status = 'active' } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const project = await prisma.project.create({
      data: {
        title,
        description,
        status,
        ownerId: req.user.userId
      },
      include: {
        tasks: true,
        _count: {
          select: { tasks: true }
        }
      }
    });
    
    // Emit WebSocket event
    const io = getIo(req);
    if (io) {
      io.to(`user-${req.user.userId}`).emit('project-created', project);
    }
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const project = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        ownerId: req.user.userId 
      }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status })
      },
      include: {
        tasks: true,
        _count: {
          select: { tasks: true }
        }
      }
    });
    
    // Emit WebSocket event
    const io = getIo(req);
    if (io) {
      io.to(`project-${req.params.id}`).emit('project-updated', updatedProject);
    }
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { 
        id: req.params.id,
        ownerId: req.user.userId 
      }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
