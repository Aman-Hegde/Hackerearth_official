import authRoutes from "./routes/auth";
import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://hackerearth-hub-nmamit.in",
  "http://localhost:3000",
];

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
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to my API");
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
