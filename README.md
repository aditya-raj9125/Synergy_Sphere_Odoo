# SynergySphere - Advanced Team Collaboration Platform

A modern, mobile-friendly web application for team collaboration and project management built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure login/signup with social login options
- **Project Management** - Create, edit, and manage projects with team members
- **Task Management** - Assign tasks with due dates, priorities, and status tracking
- **Team Collaboration** - Add team members and track progress
- **Real-time Updates** - Live status updates and notifications
- **Mobile Responsive** - Optimized for both desktop and mobile devices

### Key Features
- 📱 **Mobile-First Design** - Fully responsive interface
- 🎨 **Modern UI/UX** - Clean, intuitive design with Tailwind CSS
- 🔐 **Secure Authentication** - Protected routes and user management
- 📊 **Progress Tracking** - Visual progress bars and status indicators
- 🏷️ **Tagging System** - Organize projects and tasks with tags
- 🔔 **Notifications** - Real-time alerts for important events
- 📁 **File Attachments** - Support for project and task attachments
- 💬 **Comments** - Team communication within tasks
- 🔍 **Search & Filter** - Find projects and tasks quickly

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd synergysphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Main navigation header
│   ├── Sidebar.tsx     # Collapsible sidebar navigation
│   ├── ProjectCard.tsx # Project display card
│   ├── TaskCard.tsx    # Task display card
│   └── ProtectedRoute.tsx # Authentication guard
├── context/            # React Context providers
│   ├── AppContext.tsx  # Global app state
│   └── AuthContext.tsx # Authentication state
├── data/               # Mock data and constants
│   └── mockData.ts     # Sample data for development
├── pages/              # Main application pages
│   ├── Login.tsx       # User login page
│   ├── Signup.tsx      # User registration page
│   ├── Dashboard.tsx   # Projects overview
│   ├── ProjectDetail.tsx # Individual project view
│   ├── MyTasks.tsx     # Personal task management
│   ├── ProjectCreate.tsx # Create/edit projects
│   ├── TaskCreate.tsx  # Create/edit tasks
│   ├── TaskDetail.tsx  # Individual task view
│   └── Profile.tsx     # User profile and settings
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎯 Key Components

### Authentication
- **Login/Signup** - Secure user authentication
- **Protected Routes** - Route protection based on auth status
- **User Context** - Global user state management

### Project Management
- **Project Dashboard** - Overview of all projects
- **Project Creation** - Form-based project setup
- **Project Details** - Individual project view with tasks
- **Team Management** - Add/remove team members

### Task Management
- **Task Creation** - Assign tasks with due dates and priorities
- **Task Status** - Track progress (To-Do, In Progress, Done)
- **My Tasks** - Personal task dashboard
- **Task Details** - Detailed task view with comments

### Mobile Responsiveness
- **Responsive Grid** - Adaptive layouts for all screen sizes
- **Touch-Friendly** - Optimized for mobile interactions
- **Collapsible Sidebar** - Space-efficient navigation
- **Mobile-First Design** - Built with mobile users in mind

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Gray Scale**: 50-900 range

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Small Text**: Medium weight (500)

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Consistent input styling with focus states
- **Navigation**: Clean, accessible menu system

## 📱 Mobile Features

### Responsive Design
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: Responsive columns that adapt to screen size
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Swipe Gestures**: Natural mobile interactions

### Mobile-Specific Components
- **Collapsible Sidebar** - Saves screen space on mobile
- **Mobile Navigation** - Hamburger menu for small screens
- **Touch-Friendly Cards** - Easy to tap and interact with
- **Responsive Forms** - Optimized for mobile input

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (recommended)
- **Component Structure** - Consistent component organization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 📋 Demo Credentials

For testing purposes, use these credentials:
- **Email**: john@example.com
- **Password**: password

Or create a new account using the signup form.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern project management tools
- **Icons**: Lucide React icon library
- **Styling**: Tailwind CSS framework
- **Development**: React and TypeScript communities

---

**SynergySphere** - Where teams collaborate seamlessly, projects thrive, and productivity soars! 🚀
