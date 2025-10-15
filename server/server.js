import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-auth-two-murex.vercel.app",
  "https://mern-auth-m38s8e8wi-sagar-praveens-projects.vercel.app",
  "https://mern-auth-r3ik78kb7-sagar-praveens-projects.vercel.app",
  "https://mern-auth-8hfegh4a9-sagar-praveens-projects.vercel.app",
  "https://mern-auth-git-main-sagar-praveens-projects.vercel.app"
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-side requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy does not allow this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true // allow cookies
}));

// API Endpoints
app.get('/', (req, res) => res.send("API working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
