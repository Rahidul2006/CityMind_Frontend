import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[SOCKET] Admin Dashboard connected to server:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET] Admin Dashboard disconnected from server');
    });

    socket.on('connect_error', (err) => {
      console.error('[SOCKET] Connection error:', err.message);
    });
  }
  return socket;
};

export const joinComplaintRoom = (complaintId: string) => {
  const s = getSocket();
  if (s && complaintId) {
    s.emit('joinComplaint', complaintId);
    console.log(`[SOCKET] Joined room complaint:${complaintId}`);
  }
};

export const leaveComplaintRoom = (complaintId: string) => {
  const s = getSocket();
  if (s && complaintId) {
    s.emit('leaveComplaint', complaintId);
    console.log(`[SOCKET] Left room complaint:${complaintId}`);
  }
};

export const subscribeToStatusUpdates = (callback: (data: any) => void) => {
  const s = getSocket();
  s.on('complaint:statusUpdated', callback);
  return () => {
    s.off('complaint:statusUpdated', callback);
  };
};
