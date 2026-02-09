import { Server } from "socket.io";
import http from "http";
import express from "express";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  pingTimeout: 60000,
});

const userSocketMap = new Map(); // userId -> socketId

io.use((socket, next) => {
  try {
    const cookies = parse(socket.handshake.headers.cookie || "");
    const token = cookies.jwt;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.user.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
  }

  // broadcast to all connected clients
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      userSocketMap.delete(userId);
    }
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap.get(receiverId);
};

export { app, io, server };
