import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(SOCKET_URL);
      
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
        
        // Authenticate with the server
        newSocket.emit('authenticate', token);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      newSocket.on('authenticated', (data) => {
        console.log('Socket authenticated:', data);
      });

      newSocket.on('auth_error', (data) => {
        console.error('Socket auth error:', data);
      });

      // Room events
      newSocket.on('joined_room', (data) => {
        setRoomData(data.room);
        console.log('Joined room:', data);
      });

      newSocket.on('participant_joined', (data) => {
        setRoomData(prev => prev ? {
          ...prev,
          participants: [...prev.participants, { user: data.user, isReady: false }]
        } : null);
      });

      newSocket.on('participant_left', (data) => {
        setRoomData(prev => prev ? {
          ...prev,
          participants: prev.participants.filter(p => p.user.id !== data.userId)
        } : null);
      });

      newSocket.on('participant_ready_changed', (data) => {
        setRoomData(prev => prev ? {
          ...prev,
          participants: prev.participants.map(p => 
            p.user.id === data.userId ? { ...p, isReady: data.isReady } : p
          )
        } : null);
      });

      newSocket.on('participant_code_changed', (data) => {
        // Handle real-time code changes for spectators
        console.log('Code changed:', data);
      });

      // Chat events
      newSocket.on('new_message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      newSocket.on('error', (data) => {
        console.error('Socket error:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
        setRoomData(null);
        setMessages([]);
      }
    }
  }, [isAuthenticated, token]);

  const joinRoom = (roomId, asSpectator = false) => {
    if (socket) {
      socket.emit('join_room', { roomId, asSpectator });
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', { roomId });
      setRoomData(null);
      setMessages([]);
    }
  };

  const toggleReady = (roomId) => {
    if (socket) {
      socket.emit('toggle_ready', { roomId });
    }
  };

  const sendCodeChange = (roomId, code, language) => {
    if (socket) {
      socket.emit('code_change', { roomId, code, language });
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket) {
      socket.emit('send_message', { roomId, message });
    }
  };

  const value = {
    socket,
    connected,
    roomData,
    messages,
    joinRoom,
    leaveRoom,
    toggleReady,
    sendCodeChange,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
