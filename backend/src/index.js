import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import translationRoutes from "./routes/translationRoutes.js";
import { app, server } from "./lib/socket.js";
import { findAvailablePort, killProcessOnPort } from "./lib/serverUtils.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/translation", translationRoutes);

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: "Internal server error",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    console.log('MongoDB connected successfully');

    // Try to start the server on the specified port
    try {
      await new Promise((resolve, reject) => {
        server.listen(PORT, () => {
          console.log(`Server is running on PORT: ${PORT}`);
          resolve();
        });

        server.on('error', async (error) => {
          if (error.code === 'EADDRINUSE') {
            try {
              // Try to kill the process using the port
              await killProcessOnPort(PORT);
              console.log(`Attempting to restart server on port ${PORT}...`);
              
              // Try starting the server again
              server.listen(PORT, () => {
                console.log(`Server successfully restarted on PORT: ${PORT}`);
                resolve();
              });
            } catch (killError) {
              // If we can't kill the process, try to find an available port
              console.log(`Could not kill process on port ${PORT}, finding alternative port...`);
              const newPort = await findAvailablePort(PORT);
              if (newPort !== PORT) {
                console.log(`Original port ${PORT} was in use, using port ${newPort} instead`);
                server.listen(newPort, () => {
                  console.log(`Server is running on alternative PORT: ${newPort}`);
                  resolve();
                });
              } else {
                reject(new Error(`Could not start server on any available port`));
              }
            }
          } else {
            reject(error);
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to start server: ${error.message}`);
    }
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();
