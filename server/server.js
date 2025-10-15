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
  "https://mern-auth-two-murex.vercel.app",
  "https://mern-auth-4xn2stl8a-sagar-praveens-projects.vercel.app" // add all frontend URLs
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server requests
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
