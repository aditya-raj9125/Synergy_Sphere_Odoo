## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time updates
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Prisma** ORM for database management
- **Socket.IO** for WebSocket support
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS, Helmet, Morgan** for security and logging

### 📋 Installation Steps

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd synergysphere
```

#### 2. Install Dependencies

**Frontend Dependencies:**
```bash
npm install
```

**Backend Dependencies:**
```bash
cd backend
npm install
cd ..
```

#### 3. Database Setup

**Option A: Local PostgreSQL**
```bash
# Create a PostgreSQL database
createdb synergysphere

# Or using psql
psql -U postgres
CREATE DATABASE synergysphere;
\q
```

**Option B: Using Docker (Recommended)**
```bash
# Create a docker-compose.yml file in the root directory
cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: synergysphere
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Start PostgreSQL
docker-compose up -d
```

#### 4. Environment Configuration

Create environment files:

**Backend Environment (.env)**
```bash
cd backend
cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/synergysphere"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
EOF
```

**Frontend Environment (.env)**
```bash
cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5000
EOF
```

#### 5. Database Migration
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

#### 6. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend Development:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

#### 7. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

hanges
5. **Track Progress** - Monitor project and task status with visual indicators
6. **Manage Profile** - Update your account settings and preferences

### Key Features
- **Dashboard** - Overview of all your projects and recent activity
- **Project Management** - Create, edit, and organize projects
- **Task Management** - Assign tasks, set priorities, and track completion
- **Real-time Collaboration** - See updates from team members instantly
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Search & Filter** - Find projects and tasks quickly
- **Notifications** - Stay updated with real-time notifications

## 🛠️ Development Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Backend Scripts
```bash
cd backend
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:reset     # Reset database (development only)
npm run db:seed      # Seed database with sample data
```

### Combined Scripts (Root Directory)
```bash
npm run install:all  # Install all dependencies (frontend + backend)
npm run dev:full     # Start both frontend and backend
npm run build:all    # Build both frontend and backend
npm run test:all     # Run all tests
```

## 📊 Database Management

### Prisma Commands
```bash
cd backend

# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your-migration-name

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

### Database Schema
```sql
-- Users table
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Projects table
CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- Tasks table
CREATE TABLE "Task" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'todo',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "dueDate" TIMESTAMP(3),
  "projectId" TEXT NOT NULL,
  "assigneeId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔌 WebSocket Events

### Client to Server
- `join-user-room` - Join user's personal room
- `join-project-room` - Join project room for updates
- `project-updated` - Emit project update
- `task-updated` - Emit task update

### Server to Client
- `project-created` - New project created
- `project-updated` - Project updated
- `task-created` - New task created
- `task-updated` - Task updated

## 🏗️ Project Structure

```
synergysphere/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React contexts (Auth, App, WebSocket)
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   └── images/             # Static assets
├── backend/
│   ├── routes/             # API route handlers
│   ├── prisma/             # Database schema and migrations
│   └── server.js           # Express server with WebSocket
└── README.md
```

## 🎨 UI Components

- **Header** - Navigation and search
- **Sidebar** - Main navigation menu
- **ProjectCard** - Project display component
- **TaskCard** - Task display component
- **ProtectedRoute** - Authentication guard
- **Logo** - Brand logo component

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet security headers
- SQL injection prevention with Prisma

## 📊 Database Schema

### Users
- id, name, email, password, createdAt, updatedAt

### Projects
- id, title, description, status, ownerId, createdAt, updatedAt

### Tasks
- id, title, description, status, priority, dueDate, projectId, assigneeId, createdAt, updatedAt


