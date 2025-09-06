export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold';
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId: string;
  project?: Project;
  assigneeId: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  taskId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
}