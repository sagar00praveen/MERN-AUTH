import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middlewares
app.use(express.json()); // parse JSON body
app.use(cookieParser()); // parse cookies

// ✅ Allowed origins for CORS
const allowedOrigins = [
  "https://mern-auth-two-murex.vercel.app",
  "https://mern-auth-4xn2stl8a-sagar-praveens-projects.vercel.app",
  "https://mern-auth-gtibscu8i-sagar-praveens-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server requests
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true, // ✅ allow cookies
  })
);

// ✅ Routes
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
