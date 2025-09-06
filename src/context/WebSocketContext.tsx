import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinProjectRoom: (projectId: string) => void;
  leaveProjectRoom: (projectId: string) => void;
  emitProjectUpdate: (data: any) => void;
  emitTaskUpdate: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      newSocket.on('connect', () => {
        console.log('WebSocket connected:', newSocket.id);
        setIsConnected(true);
        
        // Join user's personal room
        newSocket.emit('join-user-room', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const joinProjectRoom = (projectId: string) => {
    if (socket) {
      socket.emit('join-project-room', projectId);
      console.log(`Joined project room: ${projectId}`);
    }
  };

  const leaveProjectRoom = (projectId: string) => {
    if (socket) {
      socket.emit('leave-project-room', projectId);
      console.log(`Left project room: ${projectId}`);
    }
  };

  const emitProjectUpdate = (data: any) => {
    if (socket) {
      socket.emit('project-updated', data);
    }
  };

  const emitTaskUpdate = (data: any) => {
    if (socket) {
      socket.emit('task-updated', data);
    }
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    joinProjectRoom,
    leaveProjectRoom,
    emitProjectUpdate,
    emitTaskUpdate,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
