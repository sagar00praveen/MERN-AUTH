import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;


connectDB();


app.use(express.json()); // parse JSON body
app.use(cookieParser()); // parse cookies


const allowedOrigins = [
  "https://mern-auth-two-murex.vercel.app",
  "https://mern-auth-4xn2stl8a-sagar-praveens-projects.vercel.app",
  "https://mern-auth-gtibscu8i-sagar-praveens-projects.vercel.app",
];
//i deplyed the frontend in vercel and backend in render witch is whey im suing const allowed = ["https://mern-auth-two-murex.vercel.app",/\.vercel\.app$/, // regex for any *.vercel.app];
//u can use norman cors funtion with allowedOrigins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server)
      if (!origin) return callback(null, true);

      // Allow any Vercel domain or your production domain
      const allowed = [
        "https://mern-auth-two-murex.vercel.app",
        /\.vercel\.app$/, // regex for any *.vercel.app
      ];

      if (allowed.some((rule) => (typeof rule === "string" ? rule === origin : rule.test(origin)))) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
  })
);



app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.listen(port, () => console.log(`Server started on PORT: ${port}`));
