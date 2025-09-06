const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join project room for real-time updates
  socket.on('join-project-room', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`User joined project room: ${projectId}`);
  });

  // Handle project updates
  socket.on('project-updated', (data) => {
    socket.to(`project-${data.projectId}`).emit('project-updated', data);
  });

  // Handle task updates
  socket.on('task-updated', (data) => {
    socket.to(`project-${data.projectId}`).emit('task-updated', data);
    socket.to(`user-${data.assigneeId}`).emit('task-updated', data);
  });

  // Handle new project creation
  socket.on('project-created', (data) => {
    socket.to(`user-${data.ownerId}`).emit('project-created', data);
  });

  // Handle new task creation
  socket.on('task-created', (data) => {
    socket.to(`project-${data.projectId}`).emit('task-created', data);
    socket.to(`user-${data.assigneeId}`).emit('task-created', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`WebSocket server ready for connections`);
});