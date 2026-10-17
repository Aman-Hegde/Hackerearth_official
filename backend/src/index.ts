import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import leaderboardRoutes from "./routes/leaderboard";
import studentRoutes from "./routes/student";
import eventRoutes from "./routes/events";
import { connectDatabase } from "./config/db";
import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {
  initializeRuntimeEnvironment,
} from "./config/localTestEnvironment";
import {
  LOCAL_TEST_POSTER_DIRECTORY,
  LOCAL_TEST_POSTER_ROUTE,
} from "./services/localEventPosterStorage";

initializeRuntimeEnvironment(process.env, () => {
  dotenv.config();
});

const app = express();

const allowedOrigins = (
  process.env.LOCAL_TEST_MODE === "true"
    ? [process.env.FRONTEND_URL]
    : [
      process.env.FRONTEND_URL,
      "https://hackerearth-official.vercel.app",
      "https://hackerearth-hub-nmamit.in",
      "http://localhost:3000",
      "http://localhost:5173",
    ]
).filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

if (process.env.LOCAL_TEST_MODE === "true") {
  app.use(
    LOCAL_TEST_POSTER_ROUTE,
    express.static(LOCAL_TEST_POSTER_DIRECTORY, {
      dotfiles: "deny",
      index: false,
      setHeaders: (res) => {
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("X-Content-Type-Options", "nosniff");
      },
    })
  );
}

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to HackerEarth Hub NMAMIT API");
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/events", eventRoutes);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    if (process.env.LOCAL_TEST_MODE === "true") {
      console.error("Failed to start the local test server.");
    } else {
      console.error("Failed to start server:", error);
    }
    process.exit(1);
  }
};

void startServer();
