import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('synergysphere_user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      apiService.setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await apiService.login(email, password) as { token: string; user: { id: string; name: string; email: string } };
      
      if (response.token && response.user) {
        apiService.setToken(response.token);
        const userData: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          initials: response.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        };
        
        setUser(userData);
        localStorage.setItem('synergysphere_user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await apiService.register(name, email, password) as { token: string; user: { id: string; name: string; email: string } };
      
      if (response.token && response.user) {
        apiService.setToken(response.token);
        const userData: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          initials: response.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        };
        
        setUser(userData);
        localStorage.setItem('synergysphere_user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    apiService.setToken(null);
    localStorage.removeItem('synergysphere_user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}