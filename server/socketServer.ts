import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // In production, specify your frontend domain
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    //Listen for 'notification' event from the client
    socket.on("notification", (data) => {
      // Broadcast the notification data to ALL connected clients, not just the sender
      io.emit("newNotification", data);
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
  console.log("Socket server initialized");
};
