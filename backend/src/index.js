// import app from "./app.js";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
dotenv.config();
// ........middlewares..........//

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Endpoints
// ............authRoutes............//
import authRoutes from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRoutes);

// ..........messageRoutes...........//
import messageRoutes from "./routes/message.routes.js";
app.use("/api/v1/message", messageRoutes);
// app listen
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port : ${process.env.PORT}`);
  connectDB();
});
