import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js"; // ✅ correct place for import
import { app, server } from "./lib/socket.js";

dotenv.config();

// const PORT = process.env.PORT;
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// ✅ Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    // origin: "http://localhost:5173",
       origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://gupshup-chat-app-git-main-hanifa-asads-projects.vercel.app",
    ],
    credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ allow all needed methods
    allowedHeaders: ["Content-Type", "Authorization"],    // 
  })
);


// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); // ✅ should come after middlewares

// ✅ Production handling

app.get("/", (req, res) => {
  res.send("API is working ✅");
});


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
// const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});