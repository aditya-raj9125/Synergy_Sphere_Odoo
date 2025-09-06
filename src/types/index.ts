export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: User;
  members: User[];
  deadline: Date;
  priority: 'Low' | 'Medium' | 'High';
  image?: string;
  tags: string[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: User;
  project: Project;
  status: 'To-Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  tags: string[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
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
