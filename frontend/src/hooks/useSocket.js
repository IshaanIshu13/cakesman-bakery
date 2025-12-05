/**
 * useSocket - React Hook for Socket.io Integration
 * Manages socket connection and event listeners
 */

import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

export const useSocket = (userId, userRole) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"]
    });

    // Connection event
    socketInstance.on("connect", () => {
      console.log("[Socket] Connected to server");
      setConnected(true);

      // Register user with their role and ID
      if (userId && userRole) {
        socketInstance.emit("user_role", userRole, userId);
      }
    });

    // Disconnection event
    socketInstance.on("disconnect", () => {
      console.log("[Socket] Disconnected from server");
      setConnected(false);
    });

    // Connection error
    socketInstance.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId, userRole]);

  /**
   * Listen to socket events
   * @param {String} event - Event name
   * @param {Function} callback - Callback function
   */
  const on = useCallback(
    (event, callback) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  /**
   * Stop listening to socket events
   * @param {String} event - Event name
   * @param {Function} callback - Callback function
   */
  const off = useCallback(
    (event, callback) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket]
  );

  /**
   * Emit socket events
   * @param {String} event - Event name
   * @param {any} data - Data to emit
   */
  const emit = useCallback(
    (event, data) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  return {
    socket,
    connected,
    on,
    off,
    emit
  };
};

export default useSocket;
