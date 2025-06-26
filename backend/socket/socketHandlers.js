import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Room from '../models/Room.js';

// Store active connections
const activeConnections = new Map();

export const handleSocketConnection = (socket, io) => {
  // Authenticate socket connection
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        socket.userId = user._id.toString();
        socket.user = user;
        activeConnections.set(socket.userId, socket.id);
        
        // Update user online status
        user.isOnline = true;
        await user.save();
        
        socket.emit('authenticated', { user: {
          id: user._id,
          username: user.username,
          level: user.level,
          avatar: user.avatar
        }});
        
        console.log(`User ${user.username} authenticated`);
      } else {
        socket.emit('auth_error', { message: 'User not found' });
      }
    } catch (error) {
      socket.emit('auth_error', { message: 'Invalid token' });
    }
  });

  // Join room
  socket.on('join_room', async (data) => {
    try {
      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      const { roomId, asSpectator = false } = data;
      const room = await Room.findOne({ roomId }).populate('participants.user host');
      
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      if (asSpectator) {
        if (room.addSpectator(socket.userId)) {
          await room.save();
          socket.join(roomId);
          socket.emit('joined_room', { room, asSpectator: true });
          socket.to(roomId).emit('spectator_joined', { 
            user: socket.user,
            spectatorCount: room.spectators.length 
          });
        } else {
          socket.emit('error', { message: 'Cannot join as spectator' });
        }
      } else {
        if (room.addParticipant(socket.userId)) {
          await room.save();
          socket.join(roomId);
          socket.emit('joined_room', { room });
          socket.to(roomId).emit('participant_joined', { 
            user: socket.user,
            participantCount: room.participants.length 
          });
        } else {
          socket.emit('error', { message: 'Room is full or you are already in the room' });
        }
      }
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Leave room
  socket.on('leave_room', async (data) => {
    try {
      if (!socket.userId) return;

      const { roomId } = data;
      const room = await Room.findOne({ roomId });
      
      if (room) {
        room.removeParticipant(socket.userId);
        room.spectators = room.spectators.filter(s => s.user.toString() !== socket.userId);
        await room.save();
        
        socket.leave(roomId);
        socket.to(roomId).emit('user_left', { 
          userId: socket.userId,
          participantCount: room.participants.length 
        });
      }
    } catch (error) {
      console.error('Leave room error:', error);
    }
  });

  // Ready status
  socket.on('toggle_ready', async (data) => {
    try {
      if (!socket.userId) return;

      const { roomId } = data;
      const room = await Room.findOne({ roomId });
      
      if (room) {
        const participant = room.participants.find(p => p.user.toString() === socket.userId);
        if (participant) {
          participant.isReady = !participant.isReady;
          await room.save();
          
          io.to(roomId).emit('participant_ready_changed', {
            userId: socket.userId,
            isReady: participant.isReady,
            allReady: room.allParticipantsReady()
          });
        }
      }
    } catch (error) {
      console.error('Toggle ready error:', error);
    }
  });

  // Code synchronization
  socket.on('code_change', (data) => {
    const { roomId, code, language } = data;
    socket.to(roomId).emit('participant_code_changed', {
      userId: socket.userId,
      code,
      language
    });
  });

  // Chat message
  socket.on('send_message', async (data) => {
    try {
      if (!socket.userId) return;

      const { roomId, message } = data;
      const room = await Room.findOne({ roomId });
      
      if (room && (room.isParticipant(socket.userId) || room.isSpectator(socket.userId))) {
        const chatMessage = {
          user: socket.userId,
          message,
          timestamp: new Date(),
          type: 'message'
        };
        
        room.chat.push(chatMessage);
        await room.save();
        
        io.to(roomId).emit('new_message', {
          ...chatMessage,
          user: socket.user
        });
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    try {
      if (socket.userId) {
        activeConnections.delete(socket.userId);
        
        // Update user offline status
        const user = await User.findById(socket.userId);
        if (user) {
          user.isOnline = false;
          user.lastSeen = new Date();
          await user.save();
        }
        
        console.log(`User ${socket.userId} disconnected`);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
};

export { activeConnections };
