import authRoutes from './routes/auth';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.send('API is running');
});

app.use('/auth', authRoutes);

// Export for serverless
export const handler = serverless(app);
