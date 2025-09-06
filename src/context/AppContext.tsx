import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Project, Task, Notification } from '../types';
import apiService from '../services/api';

interface AppState {
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  currentProject: Project | null;
  sidebarCollapsed: boolean;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  projects: [],
  tasks: [],
  notifications: [],
  currentProject: null,
  sidebarCollapsed: false,
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload ? null : state.currentProject,
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  // Project actions
  fetchProjects: () => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  
  // Task actions
  fetchTasks: (projectId?: string) => Promise<void>;
  fetchTask: (id: string) => Promise<Task | null>;
  createTask: (taskData: Partial<Task>) => Promise<Task | null>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  
  // UI actions
  setCurrentProject: (project: Project | null) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Project actions
  const fetchProjects = async (showLoading = true) => {
    try {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const projects = await apiService.getProjects() as Project[];
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch projects' });
    } finally {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const createProject = async (projectData: Partial<Project>): Promise<Project | null> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const project = await apiService.createProject(projectData) as Project;
      dispatch({ type: 'ADD_PROJECT', payload: project });
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create project' });
      return null;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project | null> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const project = await apiService.updateProject(id, projectData) as Project;
      dispatch({ type: 'UPDATE_PROJECT', payload: project });
      return project;
    } catch (error) {
      console.error('Error updating project:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update project' });
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.deleteProject(id);
      dispatch({ type: 'DELETE_PROJECT', payload: id });
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete project' });
      return false;
    }
  };

  // Task actions
  const fetchTasks = async (projectId?: string, showLoading = true) => {
    try {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const tasks = await apiService.getTasks(projectId) as Task[];
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' });
    } finally {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const fetchTask = async (id: string): Promise<Task | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const task = await apiService.getTask(id) as Task;
      return task;
    } catch (error) {
      console.error('Error fetching task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch task' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createTask = async (taskData: Partial<Task>): Promise<Task | null> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const task = await apiService.createTask(taskData) as Task;
      dispatch({ type: 'ADD_TASK', payload: task });
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create task' });
      return null;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task | null> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const task = await apiService.updateTask(id, taskData) as Task;
      dispatch({ type: 'UPDATE_TASK', payload: task });
      return task;
    } catch (error) {
      console.error('Error updating task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
      return null;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await apiService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
      return false;
    }
  };

  // UI actions
  const setCurrentProject = (project: Project | null) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  // Load initial data when component mounts
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const value: AppContextType = {
    ...state,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    setCurrentProject,
    toggleSidebar,
    addNotification,
    removeNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}