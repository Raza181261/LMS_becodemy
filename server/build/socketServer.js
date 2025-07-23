"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
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
exports.initSocketServer = initSocketServer;
